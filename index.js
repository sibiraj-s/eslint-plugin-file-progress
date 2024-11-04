import progress from './rules/progress.js';

const plugin = {
  meta: {
    name: "eslint-plugin-file-progress",
    version: "2.1.1"
  },
  configs: {},
  rules: {
    activate: progress,
  },
};

const configs = {
  recommended: {
    name: 'eslint-plugin-file-progress/recommended',
    plugins: {
      progress: plugin
    },
    rules: {
      "progress/activate": 2
    }
  },
  noCI: {
    name: 'eslint-plugin-file-progress/no-ci',
    plugins: {
      progress: plugin
    },
    rules: {
      "progress/activate": 2
    },
    settings: {
      progress: {
        hide: process.env.CI === 'true'
      }
    }
  }
}

Object.assign(plugin.configs, configs)

export default plugin
