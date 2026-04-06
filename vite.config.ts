import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  plugins: [
    devtools(),
    nitro({
      rollupConfig: { external: [/^@sentry\//, 'sharp', 'heic-convert'] },
      routeRules: {
        // Runtime option; NitroRouteConfig typings omit body size.
        '/**': { maxRequestBodySize: 50_000_000 } as Record<string, unknown>,
      },
    }),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
