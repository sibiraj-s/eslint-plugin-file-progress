import type { Linter, Rule } from 'eslint';

declare const plugin: {
  meta: {
    name: string;
    version: string;
  };
  configs: {
    recommended: Linter.Config;
    noCI: Linter.Config;
  };
  rules: {
    activate: Rule.RuleModule;
  };
};

export default plugin;
