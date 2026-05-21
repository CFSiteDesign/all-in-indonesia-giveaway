// Resolves a public/ asset path against the app's base URL, so assets work
// whether the site is served from the domain root or a deployed sub-path.
export function asset(path) {
  return import.meta.env.BASE_URL + String(path).replace(/^\/+/, "");
}
