import path from 'node:path';
import nanospinner from 'nanospinner';
import pc from 'picocolors';

const spinner = nanospinner.createSpinner('', {
  frames: ['|', '/', '-', '\\'],
  color: 'cyan',
});

let bindExit = false;
let initialReportDone = false;

const defaultSettings = {
  hide: false,
  hideFileName: false,
  successMessage: 'Lint done.',
};

const exitCallback = (exitCode, settings) => {
  if (exitCode === 0 && settings.hide !== true) {
    spinner.success({ text: settings.successMessage });
  }
};

const create = (context) => {
  const settings = { ...defaultSettings, ...context.settings.progress };

  if (!bindExit) {
    process.on('exit', (code) => {
      exitCallback(code, settings);
    });
    bindExit = true;
  }

  if (settings.hide) {
    return {};
  }

  if (!settings.hideFileName) {
    const filename = context.getFilename();
    const relativeFilePath = path.relative(context.getCwd(), filename);
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
