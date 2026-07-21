import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import { BOARD_COLUMNS } from './boardData'
import MockBoard from './MockBoard'

/**
 * jsdom implements no matchMedia; framer-motion's useReducedMotion calls it during
 * render, so shim it to report "no reduced-motion preference" and let the board mount.
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
 * jsdom has no IntersectionObserver; the board's below-the-fold <Reveal> uses
 * framer-motion `whileInView`, which constructs one on mount. Install a no-op so the
 * board renders (the dot-sync behavior under test is independent of the reveal).
 */
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

/** Installs the no-op IntersectionObserver so framer-motion's whileInView can mount. */
function stubIntersectionObserver(): void {
  window.IntersectionObserver = NoopIntersectionObserver
}

/**
 * Finds a mobile page dot by its column owner (each dot's aria-label is
 * "Show {owner}'s column"), so specs assert on the accessible name, not markup.
 * @param owner - the column owner's GitHub login.
 * @returns The dot's <button> element.
 * @example pageDotFor('gaearon') // the first column's page dot
 */
function pageDotFor(owner: string): HTMLElement {
  return screen.getByRole('button', { name: `Show ${owner}'s column` })
}

// One faked column width; jsdom reports zero layout, so the scroll handler needs a
// non-zero scrollWidth to map scrollLeft -> column index (scrollWidth / columns).
const COLUMN_WIDTH_PX = 300

// jsdom implements no scrollIntoView; page dots call it to center a column. A fresh
// spy per test lets specs assert the scroll behavior (smooth vs. instant).
let scrollIntoViewSpy: Mock<(options?: boolean | ScrollIntoViewOptions) => void>

describe('MockBoard mobile page dots', () => {
  beforeEach(() => {
    stubMatchMedia()
    stubIntersectionObserver()
    scrollIntoViewSpy =
      vi.fn<(options?: boolean | ScrollIntoViewOptions) => void>()
    Element.prototype.scrollIntoView = scrollIntoViewSpy
  })

  it('marks the swiped-to column as the current page dot', () => {
    // Arrange: render the board and grab the horizontal scroll strip (the parent of
    // the four column groups), then fake a four-column-wide strip scrolled to #3.
    render(<MockBoard />)
    const strip = screen.getAllByRole('group')[0].parentElement
    if (!strip) throw new Error('scroll strip (column groups parent) not found')
    Object.defineProperty(strip, 'scrollWidth', {
      configurable: true,
      value: COLUMN_WIDTH_PX * BOARD_COLUMNS.length,
    })
    Object.defineProperty(strip, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: COLUMN_WIDTH_PX * 2, // swipe to the third column (kentcdodds)
    })

    // Act: the strip scrolls, as a mobile swipe would drive it.
    fireEvent.scroll(strip)

    // Assert: only the third column's dot is current.
    expect(pageDotFor('kentcdodds')).toHaveAttribute('aria-current', 'true')
    expect(pageDotFor('gaearon')).toHaveAttribute('aria-current', 'false')
    expect(pageDotFor('sindresorhus')).toHaveAttribute('aria-current', 'false')
    expect(pageDotFor('antfu')).toHaveAttribute('aria-current', 'false')
  })

  it('marks the first column as current before any swipe', () => {
    // Arrange & Act
    render(<MockBoard />)

    // Assert: the board opens focused on the first column (gaearon).
    expect(pageDotFor('gaearon')).toHaveAttribute('aria-current', 'true')
    expect(pageDotFor('sindresorhus')).toHaveAttribute('aria-current', 'false')
  })

  it('smoothly scrolls the clicked column into view when its page dot is activated', () => {
    // Arrange
    render(<MockBoard />)

    // Act: activate the third column's page dot (kentcdodds).
    fireEvent.click(pageDotFor('kentcdodds'))

    // Assert: that column is centered with an animated (smooth) scroll.
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  })

  it('clamps the active page dot to the last column when overscrolled past the end', () => {
    // Arrange: render the board and fake a strip overscrolled beyond the last column,
    // exercising handleStripScroll's Math.min(..., length - 1) clamp against overscroll.
    render(<MockBoard />)
    const strip = screen.getAllByRole('group')[0].parentElement
    if (!strip) throw new Error('scroll strip (column groups parent) not found')
    Object.defineProperty(strip, 'scrollWidth', {
      configurable: true,
      value: COLUMN_WIDTH_PX * BOARD_COLUMNS.length,
    })
    Object.defineProperty(strip, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: COLUMN_WIDTH_PX * BOARD_COLUMNS.length + 999, // overscroll past the last column
    })

    // Act: the strip scrolls past its end, as a rubber-band overscroll would.
    fireEvent.scroll(strip)

    // Assert: the index clamps to the final column (antfu), never out of range.
    expect(pageDotFor('antfu')).toHaveAttribute('aria-current', 'true')
    expect(pageDotFor('kentcdodds')).toHaveAttribute('aria-current', 'false')
  })
})
