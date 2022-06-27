const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

const spinner = ora({
  spinner: 'line',
});

let bindExit = false;
let initialReportDone = false;

const defaultSettings = {
  hide: false,
  successMessage: 'Lint done.',
};

const exitCallback = (exitCode, settings) => {
  if (exitCode === 0) {
    spinner.succeed(settings.successMessage);
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

  if (!settings.hide) {
    const filename = context.getFilename();
    const relativeFilePath = path.relative(context.getCwd(), filename);
    spinner.text = `Processing: ${chalk.green(relativeFilePath)} \n`;
  } else if (!initialReportDone) {
    spinner.text = 'Linting...\n';
    initialReportDone = true;
  }

  spinner.render();
  return {};
};

const progress = {
  name: __filename,
  create,
};

module.exports = progress;
