/**
 * Safe localStorage wrapper that checks for browser environment
 * and proper localStorage API availability
 */

const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false
    if (typeof window.localStorage === 'undefined') return false
    if (typeof window.localStorage.getItem !== 'function') return false
    if (typeof window.localStorage.setItem !== 'function') return false
    if (typeof window.localStorage.removeItem !== 'function') return false

    // Test if localStorage actually works
    const testKey = '__test__'
    window.localStorage.setItem(testKey, 'test')
    window.localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isLocalStorageAvailable()) return null
    try {
      return window.localStorage.getItem(key)
    } catch (e) {
      console.warn('localStorage.getItem failed:', e)
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (!isLocalStorageAvailable()) return
    try {
      window.localStorage.setItem(key, value)
    } catch (e) {
      console.warn('localStorage.setItem failed:', e)
    }
  },

  removeItem: (key: string): void => {
    if (!isLocalStorageAvailable()) return
    try {
      window.localStorage.removeItem(key)
    } catch (e) {
      console.warn('localStorage.removeItem failed:', e)
    }
  }
}
