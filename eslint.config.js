import pegasus from 'eslint-config-pegasus'
import eslintPlugin from 'eslint-plugin-eslint-plugin'

import progress from './index.js'

export default [
  eslintPlugin.configs['flat/recommended'],
  pegasus.configs.default,
  pegasus.configs.node,
  progress.configs.recommended
]
