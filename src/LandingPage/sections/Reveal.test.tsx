import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Reveal from './Reveal'

// framer-motion's `whileInView` constructs an IntersectionObserver on mount; `animate`
// (the `immediate` path) constructs none. So the construction count is the observable
// that distinguishes the two entrance modes — see Reveal's above-the-fold contract.
let intersectionObserverConstructions = 0

/**
 * jsdom has no matchMedia; framer-motion's useReducedMotion calls it on render.
 * Shim it to report "no reduced-motion preference" so Reveal mounts normally.
 * @example stubMatchMedia() // window.matchMedia(...).matches === false
 */
function stubMatchMedia(): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

/**
 * Counting IntersectionObserver stub: increments a module counter on construction so a
 * spec can prove whether framer-motion set up a scroll observer for a given Reveal.
 */
class CountingIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly scrollMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  constructor() {
    intersectionObserverConstructions += 1
  }
  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve(): void {}
}

describe('Reveal entrance', () => {
  beforeEach(() => {
    intersectionObserverConstructions = 0
    stubMatchMedia()
    window.IntersectionObserver = CountingIntersectionObserver
  })

  it('reveals above-the-fold content on mount without waiting on an IntersectionObserver', () => {
    // Arrange & Act: an immediate reveal wraps hero content.
    render(
      <Reveal immediate>
        <span>hero headline</span>
      </Reveal>,
    )

    // Assert: content is shown, and no scroll observer was needed to reveal it.
    expect(screen.getByText('hero headline')).toBeInTheDocument()
    expect(intersectionObserverConstructions).toBe(0)
  })

  it('defers below-the-fold content to scroll-into-view via an IntersectionObserver', () => {
    // Arrange & Act: a default (non-immediate) reveal wraps a lower section.
    render(
      <Reveal>
        <span>below the fold</span>
      </Reveal>,
    )

    // Assert: content renders, and framer-motion set up one scroll observer for it.
    expect(screen.getByText('below the fold')).toBeInTheDocument()
    expect(intersectionObserverConstructions).toBeGreaterThan(0)
  })
})
