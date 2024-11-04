import type { Rule } from 'eslint';

export = plugin;

declare const plugin: {
  meta: {
    name: string;
    version: string;
  };
  configs: {};
  rules: {
    activate: Rule.RuleModule;
  };
};
