import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import nanospinner from 'nanospinner';
import pc from 'picocolors';

const REGISTRY_DIR = path.join(os.tmpdir(), 'eslint-plugin-file-progress');
const PID_FILE = path.join(REGISTRY_DIR, String(process.pid));

const getActivePids = () => {
  let entries;
  try {
    entries = fs.readdirSync(REGISTRY_DIR);
  } catch {
    return [];
  }
  return entries.filter((entry) => {
    const pid = Number(entry);
    if (!pid) {return false};
    try {
      process.kill(pid, 0);
      return true;
    } catch (e) {
      if (e.code === 'EPERM') {return true}; // process exists, no permission to signal
      try { fs.unlinkSync(path.join(REGISTRY_DIR, entry)); } catch { /* ignore */ }
      return false; // ESRCH = dead process, stale file removed
    }
  });
};

// Register this process. Returns true if other live processes were already registered.
const register = () => {
  try {
    fs.mkdirSync(REGISTRY_DIR, { recursive: true });
    fs.writeFileSync(PID_FILE, '');
  } catch { /* ignore */ }
  return getActivePids().length > 1;
};

// Deregister this process. Returns true if this was the last active process.
const deregister = () => {
  try { fs.unlinkSync(PID_FILE); } catch { /* ignore */ }
  const remaining = getActivePids();
  if (remaining.length === 0) {
    try { fs.rmdirSync(REGISTRY_DIR); } catch { /* ignore ENOTEMPTY race */ }
    return true;
  }
  return false;
};

const spinner = nanospinner.createSpinner('', {
  frames: ['|', '/', '-', '\\'],
  color: 'cyan',
});

let bindExit = false;
let initialReportDone = false;
let isConcurrent = false;
let registered = false;

const defaultSettings = {
  hide: false,
  hideFileName: false,
  successMessage: 'Lint done.',
};

const exitCallback = (exitCode, settings) => {
  const isLast = deregister(); // always deregister, even on error/hide

  if (exitCode !== 0 || settings.hide === true) {
    return;
  }

  if (!isLast) {
    return; // another process will print the done message
  }

  if (isConcurrent) {
    process.stderr.write(`✔ ${settings.successMessage}\n`);
  } else {
    spinner.success({ text: settings.successMessage });
  }
};

const create = (context) => {
  const settings = { ...defaultSettings, ...context.settings.progress };

  if (!registered) {
    isConcurrent = register();
    registered = true;
  }

  if (!bindExit) {
    process.on('exit', (code) => {
      exitCallback(code, settings);
    });
    bindExit = true;
  }

  if (settings.hide) {
    return {};
  }

  if (isConcurrent) {
    // No ANSI escape sequences — plain line per file to avoid garbling other processes
    if (!settings.hideFileName) {
      const relativeFilePath = path.relative(context.cwd, context.filename);
      process.stderr.write(`Processing: ${pc.green(relativeFilePath)}\n`);
    } else if (!initialReportDone) {
      process.stderr.write('Linting...\n');
      initialReportDone = true;
    }
    return {};
  }

  // Single-process mode: existing spinner behavior unchanged
  if (!settings.hideFileName) {
    const relativeFilePath = path.relative(context.cwd, context.filename);
    spinner.update({ text: `Processing: ${pc.green(relativeFilePath)} \n` });
  } else if (!initialReportDone) {
    spinner.update({ text: 'Linting...\n' });
    initialReportDone = true;
  }

  spinner.spin();
  return {};
};

const progress = {
  name: import.meta.filename,
  meta: {
    type: 'suggestion',
    messages: [],
    schema: []
  },
  create,
};

export default progress;
