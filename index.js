import progress from './rules/progress.js';

const plugin = {
  meta: {
    name: "eslint-plugin-file-progress",
    version: "2.1.2"
  },
  configs: {},
  rules: {
    activate: progress,
  },
};

const configs = {
  recommended: {
    name: 'progress/recommended',
    plugins: {
      progress: plugin
    },
    rules: {
      "progress/activate": 2
    }
  },
  'recommended-ci': {
    name: 'progress/recommended-ci',
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
