/// <reference types="vitest" />
import { writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { peerDependencies } from './package.json'

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: false, // disable inline declarations
      insertTypesEntry: true, // add "types" entry to package.json
      outDir: 'dist', // output declarations in dist
      entryRoot: 'src',
      exclude: ['src/test/**', 'src/**/*.stories.*', 'src/icons/font.d.ts']
    }), // Output .d.ts files
    {
      // emit the `./font` types entry — declares the side-effect CSS import so
      // `import 'dsssp/font'` type-checks for consumers
      name: 'emit-font-dts',
      closeBundle() {
        writeFileSync(
          resolve(__dirname, 'dist', 'font.d.ts'),
          "declare module '*.css'\n"
        )
      }
    }
  ],
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: resolve(__dirname, join('src', 'index.ts')),
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // Exclude peer dependencies from the bundle to reduce bundle size
      external: ['react/jsx-runtime', ...Object.keys(peerDependencies)]
    }
  }
})
