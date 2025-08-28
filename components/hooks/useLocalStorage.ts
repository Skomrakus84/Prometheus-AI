
import { useState, useEffect } from 'react';

/**
 * A custom React hook that syncs state with the browser's localStorage.
 * This allows state to persist across page reloads.
 * @template T The type of the value to be stored.
 * @param {string} key The key under which the value is stored in localStorage.
 * @param {T} initialValue The initial value to use if no value is found in localStorage.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} A tuple containing the current state value and a function to update it.
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // useEffect to update localStorage when the state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
