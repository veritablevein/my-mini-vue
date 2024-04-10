import { defineConfig, defineWorkspace } from 'vitest/config'

export default defineWorkspace(['packages/*'])

export const configShared = defineConfig({
  test: {
    globals: true,
  },
})
