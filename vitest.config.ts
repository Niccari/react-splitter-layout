import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    moduleNameMapper: {
      '\\.(css)$': 'identity-obj-proxy'
    },
    coverage: {
      include: ['src/components/**/*.{ts,tsx}']
    }
  }
});
