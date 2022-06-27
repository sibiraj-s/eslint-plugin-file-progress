const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

const spinner = ora({
  spinner: 'line',
});

let bindExit = false;
let initialReportDone = false;

const rootPath = process.cwd();

const exitCallback = (exitCode, settings) => {
  if (exitCode === 0) {
    const successMessage = typeof settings['success-message'] === 'string'
      ? settings['success-message']
      : 'Lint done...';
    spinner.succeed(successMessage);
  }
};

const create = (context) => {
  if (!bindExit) {
    process.on('exit', (code) => {
      exitCallback(code, context.settings);
    });
    bindExit = true;
  }

  if (!context.settings['hide-progress']) {
    const filename = context.getFilename();
    const relativeFilePath = path.relative(rootPath, filename);
    spinner.text = `Processing: ${chalk.green(relativeFilePath)} \n`;
  } else if (!initialReportDone) {
    spinner.text = 'Linting \n';
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
