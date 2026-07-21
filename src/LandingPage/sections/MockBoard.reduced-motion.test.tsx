import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import MockBoard from './MockBoard'

// framer-motion's standalone useReducedMotion reads the prefers-reduced-motion media
// query ONCE per module and caches it in a global singleton, so a reduced-motion spec
// must own its test file: vitest isolates module registries per file, letting this file
// report "reduce" before the first render and lock the cached preference to true. (A
// mid-file matchMedia override in the main spec cannot change it after the first read.)

/** Report a prefers-reduced-motion: reduce preference for every media query. */
function stubReducedMotionMatchMedia(): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

/** No-op IntersectionObserver so framer-motion's whileInView can mount the board. */
class NoopIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly scrollMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve(): void {}
}

/** Finds a mobile page dot by its column owner (aria-label "Show {owner}'s column"). */
function pageDotFor(owner: string): HTMLElement {
  return screen.getByRole('button', { name: `Show ${owner}'s column` })
}

describe('MockBoard with reduced motion', () => {
  let scrollIntoViewSpy: Mock<
    (options?: boolean | ScrollIntoViewOptions) => void
  >

  beforeEach(() => {
    stubReducedMotionMatchMedia()
    window.IntersectionObserver = NoopIntersectionObserver
    scrollIntoViewSpy =
      vi.fn<(options?: boolean | ScrollIntoViewOptions) => void>()
    Element.prototype.scrollIntoView = scrollIntoViewSpy
  })

  it('jumps to the clicked column instantly instead of animating the scroll', () => {
    // Arrange
    render(<MockBoard />)

    // Act: activate the second column's page dot (sindresorhus).
    fireEvent.click(pageDotFor('sindresorhus'))

    // Assert: instant jump (behavior 'auto'), honoring prefers-reduced-motion.
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: 'auto',
      inline: 'center',
      block: 'nearest',
    })
  })
})
