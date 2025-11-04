export async function register() {
  if (typeof window === 'undefined') {
    // Override any broken localStorage polyfill during SSR
    const safeStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    }

    // @ts-ignore - Override global localStorage if it exists but is broken
    if (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined') {
      // @ts-ignore
      global.localStorage = safeStorage
    }

    // @ts-ignore
    if (typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined') {
      // @ts-ignore
      globalThis.localStorage = safeStorage
    }
  }
}
