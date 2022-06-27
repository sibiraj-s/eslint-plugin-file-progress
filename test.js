const { RuleTester } = require('eslint');

const progress = require('./rules/progress');

const ruleTester = new RuleTester();
const ruleName = 'file-progress/activate';

ruleTester.run(ruleName, progress, {
  valid: [
    'var foo = \'bar\'',
    {
      code: 'var foo = \'bar\'',
      settings: {
        progress: {
          hide: false,
          successMessage: 'Lint done...',
        },
      },
    },
  ],
  invalid: [],
});
