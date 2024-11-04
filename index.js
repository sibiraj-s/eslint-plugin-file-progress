import progress from './rules/progress.js';

const plugin = {
  meta: {
    name: "eslint-plugin-example",
    version: "1.5.0"
  },
  configs: {},
  rules: {
    activate: progress,
  },
};

export default plugin
