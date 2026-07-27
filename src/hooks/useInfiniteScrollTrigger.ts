import { useEffect, useRef } from 'react'

export function useInfiniteScrollTrigger(onTrigger: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onTriggerRef = useRef(onTrigger)
  onTriggerRef.current = onTrigger

  useEffect(() => {
    if (!enabled) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onTriggerRef.current()
      },
      { rootMargin: '600px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled])

  return sentinelRef
}
