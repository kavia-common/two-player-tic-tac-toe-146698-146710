import { Platform } from 'react-native';

// PUBLIC_INTERFACE
export interface IAsyncStorage {
  /** Get a string value for a key, or null if not present or on error. */
  getItem(key: string): Promise<string | null>;
  /** Set a string value for a key. */
  setItem(key: string, value: string): Promise<void>;
  /** Remove a key/value pair. */
  removeItem(key: string): Promise<void>;
}

/**
 * Lightweight web polyfill using window.localStorage for Expo web builds.
 * On native platforms, we defer to '@react-native-async-storage/async-storage'.
 */
let storage: IAsyncStorage;

if (Platform.OS === 'web') {
  const safeLocalStorage = typeof window !== 'undefined' ? window.localStorage : undefined;

  storage = {
    async getItem(key: string) {
      try {
        if (!safeLocalStorage) return null;
        const value = safeLocalStorage.getItem(key);
        return value !== null ? value : null;
      } catch {
        return null;
      }
    },
    async setItem(key: string, value: string) {
      try {
        if (!safeLocalStorage) return;
        safeLocalStorage.setItem(key, value);
      } catch {
        // ignore
      }
    },
    async removeItem(key: string) {
      try {
        if (!safeLocalStorage) return;
        safeLocalStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
} else {
  // Native: use actual AsyncStorage implementation via dynamic import to avoid bundling issues on web.
  // We provide thin wrappers that import on first use to keep initialization synchronous.
  let nativeModulePromise: Promise<{
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }> | null = null;

  const getNative = async () => {
    if (!nativeModulePromise) {
      nativeModulePromise = import('@react-native-async-storage/async-storage').then(m => m.default);
    }
    return nativeModulePromise;
  };

  storage = {
    async getItem(key: string) {
      const Native = await getNative();
      return Native.getItem(key);
    },
    async setItem(key: string, value: string) {
      const Native = await getNative();
      return Native.setItem(key, value);
    },
    async removeItem(key: string) {
      const Native = await getNative();
      return Native.removeItem(key);
    },
  };
}

// PUBLIC_INTERFACE
export default storage;
