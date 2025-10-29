import { Page } from '@playwright/test'

/**
 * Get item from localStorage
 */
export async function getLocalStorageItem(
  page: Page,
  key: string,
): Promise<string | null> {
  return page.evaluate((storageKey) => {
    return localStorage.getItem(storageKey)
  }, key)
}

/**
 * Set item in localStorage
 */
export async function setLocalStorageItem(
  page: Page,
  key: string,
  value: string,
): Promise<void> {
  await page.evaluate(
    ({ storageKey, storageValue }) => {
      localStorage.setItem(storageKey, storageValue)
    },
    { storageKey: key, storageValue: value },
  )
}

/**
 * Remove item from localStorage
 */
export async function removeLocalStorageItem(
  page: Page,
  key: string,
): Promise<void> {
  await page.evaluate((storageKey) => {
    localStorage.removeItem(storageKey)
  }, key)
}

/**
 * Clear all localStorage
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
  })
}

/**
 * Get all localStorage keys
 */
export async function getLocalStorageKeys(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    return Object.keys(localStorage)
  })
}

/**
 * Get Redux persist state
 */
export async function getReduxPersistedState(page: Page): Promise<unknown> {
  const state = await getLocalStorageItem(page, 'persist:Geek-Infiltration')
  if (!state) return null

  try {
    return JSON.parse(state)
  } catch {
    return null
  }
}

/**
 * Set Redux persist state
 */
export async function setReduxPersistedState(
  page: Page,
  state: Record<string, unknown>,
): Promise<void> {
  await setLocalStorageItem(
    page,
    'persist:Geek-Infiltration',
    JSON.stringify(state),
  )
}

/**
 * Get specific Redux slice from persisted state
 */
export async function getReduxSlice(
  page: Page,
  sliceName: string,
): Promise<unknown> {
  const state = await getReduxPersistedState(page)
  if (!state || typeof state !== 'object') return null

  try {
    const slice = (state as Record<string, string>)[sliceName]
    return slice ? JSON.parse(slice) : null
  } catch {
    return null
  }
}

/**
 * Set specific Redux slice in persisted state
 */
export async function setReduxSlice(
  page: Page,
  sliceName: string,
  sliceData: Record<string, unknown>,
): Promise<void> {
  const currentState = (await getReduxPersistedState(page)) || {}

  const newState = {
    ...currentState,
    [sliceName]: JSON.stringify(sliceData),
    _persist: {
      version: -1,
      rehydrated: true,
    },
  }

  await setReduxPersistedState(page, newState)
}

/**
 * Wait for Redux rehydration
 */
export async function waitForReduxRehydration(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const state = localStorage.getItem('persist:Geek-Infiltration')
    if (!state) return false

    try {
      const parsed = JSON.parse(state)
      return parsed._persist?.rehydrated === true
    } catch {
      return false
    }
  })
}

/**
 * Session storage helpers
 */
export const sessionStorage = {
  /**
   * Get item from sessionStorage
   */
  async getItem(page: Page, key: string): Promise<string | null> {
    return page.evaluate((storageKey) => {
      return window.sessionStorage.getItem(storageKey)
    }, key)
  },

  /**
   * Set item in sessionStorage
   */
  async setItem(page: Page, key: string, value: string): Promise<void> {
    await page.evaluate(
      ({ storageKey, storageValue }) => {
        window.sessionStorage.setItem(storageKey, storageValue)
      },
      { storageKey: key, storageValue: value },
    )
  },

  /**
   * Remove item from sessionStorage
   */
  async removeItem(page: Page, key: string): Promise<void> {
    await page.evaluate((storageKey) => {
      window.sessionStorage.removeItem(storageKey)
    }, key)
  },

  /**
   * Clear all sessionStorage
   */
  async clear(page: Page): Promise<void> {
    await page.evaluate(() => {
      window.sessionStorage.clear()
    })
  },
}
