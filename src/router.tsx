import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

function createRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  })
}

/** Client-only singleton; SSR must use a fresh router per request (see TanStack Router `beforeLoad` + shared mutable state). */
let clientRouter: ReturnType<typeof createRouter> | undefined

export function getRouter() {
  if (import.meta.env.SSR) {
    return createRouter()
  }
  clientRouter ??= createRouter()
  return clientRouter
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
