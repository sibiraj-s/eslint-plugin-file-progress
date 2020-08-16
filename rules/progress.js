const ora = require('ora');
const chalk = require('chalk');

const spinner = ora({
  spinner: 'line',
});

let bindExit = false;

const exitCallback = (exitCode) => {
  if (exitCode === 0) {
    spinner.succeed('Lint done...');
  }
};

const rootPath = `${process.cwd()}/`;

const create = (context) => {
  if (!bindExit) {
    process.on('exit', exitCallback);
    bindExit = true;
  }

  const filename = context.getFilename();
  const relativeFilePath = filename.replace(rootPath, '');

  spinner.text = `Processing: ${chalk.green(relativeFilePath)} \n`;
  spinner.render();

  return {};
};

const progress = {
  name: __filename,
  create,
};

module.exports = progress;
