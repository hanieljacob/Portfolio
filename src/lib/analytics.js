// Google Analytics 4 loader.
//
// The measurement ID is read from the VITE_GA_ID env var (e.g. "G-XXXXXXXXXX").
// GA measurement IDs are public (they ship in the client bundle), so this is not
// a secret — it lives in an env var so dev/localhost traffic isn't tracked and the
// ID isn't hardcoded. If VITE_GA_ID is unset (e.g. local dev), this is a no-op.
export function initAnalytics() {
  const measurementId = import.meta.env.VITE_GA_ID
  if (!measurementId) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', measurementId)
}
