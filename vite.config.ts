import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import type { NitroConfig } from 'nitro/types'

/** Merged into Nitro via the Vite plugin (`nitro({ config })`). */
const nitroAppConfig = {
  preset: 'node-server' as const,
  rollupConfig: {
    external: [/^@sentry\//, 'sharp', 'heic-convert'],
  },
  routeRules: {
    '/**': {
      maxRequestBodySize: 50_000_000,
    },
  },
} as NitroConfig

export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    nitro({ config: nitroAppConfig }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})
