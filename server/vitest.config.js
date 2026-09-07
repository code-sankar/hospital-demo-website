import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: ['./tests/globalSetup.js'],
    setupFiles: ['./tests/setup.js'],
    // The suite shares one Postgres database, so files must not race each other.
    fileParallelism: false,
    testTimeout: 20_000,
  },
})
