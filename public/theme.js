(() => {
  try {
    const stored = window.localStorage.getItem('nuxt-color-mode')
    const mode = stored === 'dark' || stored === 'light'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(mode)
    root.dataset.colorMode = mode
    root.style.colorScheme = mode
  } catch {
    /* Keep the SSR light theme when storage is unavailable. */
  }
})()
