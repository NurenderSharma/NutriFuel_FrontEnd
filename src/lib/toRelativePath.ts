export function toRelativePath(absoluteOrRelativeUrl: string): string {
  try {
    const url = new URL(absoluteOrRelativeUrl, window.location.origin)
    return `${url.pathname}${url.search}`
  } catch {
    return absoluteOrRelativeUrl
  }
}
