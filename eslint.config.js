import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()
export default antfu(
  {
    ignores: ['node_modules', 'dist', 'coverage', '*.md'],
  },
  ...compat.config({
    extends: ['plugin:prettier/recommended'],
  }),
  {
    rules: {
      'antfu/if-newline': 'off',
      'style/arrow-parens': 'off',
      'style/operator-linebreak': 'off',
      'style/indent-binary-ops': 'off',
    },
  },
)
