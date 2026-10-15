import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ProgressStore, STORAGE_KEY } from '../services/ProgressStore.js';

const ProgressContext = createContext(null);
export function ProgressProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    let storage;
    try { storage = window.localStorage; } catch { storage = undefined; }
    storeRef.current = new ProgressStore(storage);
  }
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const listener = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) { storeRef.current.data = { schemaVersion: 1, courses: {} }; storeRef.current.reload(); refresh(); }
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [refresh]);
  const mutate = useCallback((method, ...args) => { storeRef.current[method](...args); refresh(); }, [refresh]);
  return <ProgressContext.Provider value={{ store: storeRef.current, mutate, revision }}>{children}</ProgressContext.Provider>;
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('ProgressProvider is required');
  return value;
}
