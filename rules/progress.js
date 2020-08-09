const ora = require('ora');
const cliSpinners = require('cli-spinners');

const spinner = ora({
  spinner: cliSpinners.line,
  interval: 10 * 1000,
});

let bindExit = false;

const exitCallback = (exitCode) => {
  if (exitCode === 0) {
    spinner.succeed('Lint done...');
  }
};

const rootPath = process.cwd() + '/';

const progress = {
  name: __filename,
  create: function (context) {
    if (!bindExit) {
      process.on('exit', exitCallback);
      bindExit = true;
    }

    const filename = context.getFilename();
    const relativeFilePath = filename.replace(rootPath, '');

    spinner.text = 'Processing: ' + relativeFilePath + '\n';
    spinner.render();

    return {};
  },
};

module.exports = progress;
