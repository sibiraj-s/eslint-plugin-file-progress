const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

const spinner = ora({
  spinner: 'line',
});

let bindExit = false;
let initialReportDone = false;

const exitCallback = (exitCode, settings) => {
  if (exitCode === 0) {
    spinner.succeed(
      settings && typeof settings['success-message'] === 'string'
        ? settings['success-message']
        : 'Lint done...',
    );
  } else {
    spinner.fail(
      settings && typeof settings['fail-message'] === 'string'
        ? settings['fail-message']
        : 'Lint done with errors.',
    );
  }
};

const rootPath = process.cwd();

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
    spinner.render();
  } else if (!initialReportDone) {
    spinner.text = 'Linting \n';
    spinner.render();
    initialReportDone = true;
  }

  return {};
};

const progress = {
  name: __filename,
  create,
};

module.exports = progress;
