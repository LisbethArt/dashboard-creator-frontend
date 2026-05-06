import { animate, cubicBezier } from 'framer-motion'
import type { MouseEvent } from 'react'

/** Matches fixed top bar (~64px) plus small breathing room below it. */
export const LANDING_SCROLL_HEADER_GAP_PX = 80

function motionReduced(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Smoothly scrolls the window so ``#elementId`` aligns under the sticky header.
 * Uses Framer Motion for the interpolated scroll position (easier than raw ``scrollIntoView`` with a fixed navbar).
 */
export function smoothScrollToAnchorId(elementId: string): void {
  const el = document.getElementById(elementId)
  if (!el) return

  const targetY = Math.max(
    0,
    el.getBoundingClientRect().top + window.scrollY - LANDING_SCROLL_HEADER_GAP_PX,
  )

  try {
    window.history.replaceState(null, '', `#${elementId}`)
  } catch {
    /* ignore malformed history */
  }

  if (motionReduced()) {
    window.scrollTo(0, targetY)
    return
  }

  animate(window.scrollY, targetY, {
    duration: 1,
    ease: cubicBezier(0.22, 1, 0.36, 1),
    onUpdate: (latest) => {
      window.scrollTo(0, latest)
    },
  })
}

export function landingNavAnchorClick(
  event: MouseEvent<HTMLAnchorElement>,
  elementId: string,
): void {
  event.preventDefault()
  smoothScrollToAnchorId(elementId)
}
