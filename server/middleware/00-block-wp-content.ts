import { createError, defineEventHandler } from 'h3'

/**
 * Legacy WordPress probe URLs must not reach TanStack Start SSR: on the server, TanStack Router
 * `beforeLoad` compares `latestLocation.publicHref` to `buildLocation({...}).publicHref` and
 * throws `redirect()` (default 307) when they differ. For paths that are not real routes, that
 * comparison can fail to stabilize → infinite 307 to the same Location. Responding here with
 * 404 avoids that code path entirely (no redirect).
 */
function isLegacyWordPressPath(pathname: string) {
  for (const base of ['wp-content', 'wp-includes', 'wp-admin']) {
    const root = `/${base}`
    if (pathname === root || pathname.startsWith(`${root}/`)) return true
  }
  return false
}

export default defineEventHandler((event) => {
  if (isLegacyWordPressPath(event.url.pathname)) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
})
