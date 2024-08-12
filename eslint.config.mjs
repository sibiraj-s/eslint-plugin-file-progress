import pegasus from 'eslint-config-pegasus'
import eslintPlugin from 'eslint-plugin-eslint-plugin'

export default [
  eslintPlugin.configs['flat/recommended'],
  pegasus.configs.default,
  pegasus.configs.node,
]
