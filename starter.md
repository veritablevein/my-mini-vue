create a template with pnpm monorepo + TypeScript + Vite + Vitest + ESlint + Prettier + simple-git-hooks + lint-staged
```bash
mkdir project-name
cd project-name
# 项目初始化
pnpm init
# 创建pnpm monorepo配置文件
mkdir packages
touch pnpm-workspace.yaml
echo "packages:" > pnpm-workspace.yaml
echo "  - 'packages/*'" >> pnpm-workspace.yaml
# 安装开发环境依赖
pnpm add -Dw vite vitest @vitest/ui typescript @types/node simple-git-hooks lint-staged picocolors eslint @antfu/eslint-config prettier
npx tsc --init
touch vite.config.ts
touch vitest.workspace.ts
```
```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```
```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
})
```
vitest工作空间配置
```ts
// vitest.workspace.ts
import { defineConfig, defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/*'
])

export const configShared = defineConfig({
  test: {
    // 类似Jest的全局模式，还需要配合tsconfig.json
    globals: true
  }
})
```
项目单独配置vitest
```ts
// packages/project/vitest.config.ts
import { defineProject, mergeConfig } from 'vitest/config'
import { configShared } from '../../vitest.workspace'

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      environment: 'node'
    }
  })
)
```
vitest全局模式类型提示
```json
// tsconfig.json
{
    "compilerOptions": {
        "types": ["vitest/globals"],
    }
}
```
配置eslint、prettier
```js
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', 'dist', 'coverage'],
})
```
```js
// prettier.config.mjs
export default {
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  barcketSpacing: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
}
```
配置vitest、simple-git-hooks、lint-staged，首次需执行pnpm postinstall
```json
// package.json
{
  "type": "module",
  "script": {
    "check": "tsc --incremental --noEmit",
    "lint": "eslint --ext .ts,.tsx,.vue,.js,.jsx src --fix",
    "postinstall": "simple-git-hooks",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged && pnpm check",
    "commit-msg": "node scripts/verify-commit.js"
  },
  "lint-staged": {
    "*.{js,json}": ["prettier --write"],
    "*.ts?(x)": ["eslint --fix", "prettier --parser=typescript --write"]
  }
}
```
工作空间项目之间的依赖
```json
// packages/project/package.json
{
  "name": "@my-mini-vue/reactivity",
  "version": "1.0.0",
  "description": "",
  "main": "@my-mini-vue/reactivity",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@my-mini-vue/shared": "workspace:^1.0.0"
  }
}
```
commit lint脚本
```js
// scripts/verify-commit.js
// @ts-check
import pico from 'picocolors'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const msgPath = path.resolve('.git/COMMIT_EDITMSG')
const msg = readFileSync(msgPath, 'utf-8').trim()

const commitRE =
  /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${pico.white(pico.bgRed(' ERROR '))} ${pico.red(
      `invalid commit message format.`,
    )}\n\n` +
      pico.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`,
      ) +
      `    ${pico.green(`feat(compiler): add 'comments' option`)}\n` +
      `    ${pico.green(
        `fix(v-model): handle events on blur (close #28)`,
      )}\n\n` +
      pico.red(`  See .github/commit-convention.md for more details.\n`),
  )
  process.exit(1)
}
```
```bash
# 执行postinstall使simple-git-hooks、lint-staged生效
pnpm postinstall
# 测试是否生效
git add .
git commit -m "chore: init"
```
解决eslint和prettier冲突
```bash
# 安装eslint-config-prettier eslint-plugin-prettier
pnpm add -Dw eslint-config-prettier eslint-plugin-prettier 
```
```js
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', 'dist', 'coverage'],
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
})
```
