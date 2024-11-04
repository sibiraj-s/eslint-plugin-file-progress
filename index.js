import progress from './rules/progress.js';

const plugin = {
  meta: {
    name: "eslint-plugin-file-progress",
    version: "2.0.1"
  },
  configs: {},
  rules: {
    activate: progress,
  },
};

export default plugin
