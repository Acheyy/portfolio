import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Vite 8's Rolldown bundler drops Nitro's #nitro-vite-setup polyfill from the
// production build, so the SSR renderer's fetch(req, { viteEnv: "ssr" }) falls
// through to native fetch and loops back to the server, causing ECONNRESET.
// This wrapper patches globalThis.fetch to intercept viteEnv calls and route
// them to TanStack Start's SSR handler before the server starts.

const ssrMod = await import(resolve(__dirname, '.nitro/vite/services/ssr/server.js'))
const ssrService = ssrMod.default || ssrMod

const nativeFetch = globalThis.fetch
globalThis.fetch = function (input, init) {
  if (init?.viteEnv) {
    if (!(input instanceof Request)) {
      input = new Request(input, init)
    }
    return ssrService.fetch(input)
  }
  return nativeFetch.call(globalThis, input, init)
}

await import(resolve(__dirname, '.output/server/index.mjs'))
