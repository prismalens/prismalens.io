// Fades `.reveal` elements in on first sight; a `[data-load]` inside one swaps its skeleton for content.
export function initReveals(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const els = document.querySelectorAll<HTMLElement>('.reveal')
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'))
    return
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        el.classList.add('in')
        io.unobserve(el)
        const load = el.querySelector('[data-load]')
        if (load) setTimeout(() => load.classList.add('is-loaded'), reduce ? 0 : 1100)
      }),
    { threshold: 0.18, rootMargin: '0px 0px -40px 0px' },
  )
  els.forEach((el) => io.observe(el))
}
