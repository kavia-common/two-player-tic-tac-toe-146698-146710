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

/** Typed interface to represent the native async-storage module's default export. */
type NativeAsyncStorageModule = IAsyncStorage;

/**
 * Lightweight storage abstraction:
 * - Web: uses localStorage if available.
 * - Native: attempts to dynamically import '@react-native-async-storage/async-storage'.
 *           If the native module is not installed/available, it gracefully no-ops.
 */
let storage: IAsyncStorage;

const createWebStorage = (): IAsyncStorage => {
  const safeLocalStorage =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
      ? window.localStorage
      : undefined;

  return {
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
        // ignore errors in web fallback
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
};

const createNoopStorage = (): IAsyncStorage => ({
  async getItem() {
    return null;
  },
  async setItem() {
    // noop
  },
  async removeItem() {
    // noop
  },
});

if (Platform.OS === 'web') {
  storage = createWebStorage();
} else {
  // Native platforms: attempt to load async-storage dynamically on first access.
  let nativeModulePromise: Promise<NativeAsyncStorageModule> | null = null;

  const getNative = async (): Promise<NativeAsyncStorageModule> => {
    if (!nativeModulePromise) {
      try {
        nativeModulePromise = import('@react-native-async-storage/async-storage').then(
          (m) => m.default as NativeAsyncStorageModule
        );
      } catch {
        // If dynamic import itself throws synchronously, fall back to noop.
        nativeModulePromise = Promise.resolve(createNoopStorage());
      }
    }
    return nativeModulePromise;
  };

  storage = {
    async getItem(key: string) {
      try {
        const Native = await getNative();
        return Native.getItem(key);
      } catch {
        return null;
      }
    },
    async setItem(key: string, value: string) {
      try {
        const Native = await getNative();
        await Native.setItem(key, value);
      } catch {
        // noop if unavailable
      }
    },
    async removeItem(key: string) {
      try {
        const Native = await getNative();
        await Native.removeItem(key);
      } catch {
        // noop if unavailable
      }
    },
  };
}

// PUBLIC_INTERFACE
export default storage;
