import { defineProject, mergeConfig } from 'vitest/config'
import { configShared } from '../../vitest.workspace'

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      environment: 'node',
    },
  }),
)
