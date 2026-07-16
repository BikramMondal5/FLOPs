import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
      include: [
        'features/**/calculators/**/*.ts',
        'features/**/prompt-builders/**/*.ts',
        'features/**/mappers/**/*.ts',
        'features/**/parsers/**/*.ts',
        'lib/utils.ts',
      ],
    },
  },
});
