import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    // tanstackStart MUST come before viteReact
    tanstackStart({
      srcDirectory: 'app',
    }),
    viteReact(),
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
  ],
})
