/**
 * Custom Hook: useLocalStorage
 */
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsInitialized(true);
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

/**
 * Custom Hook: useDebounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom Hook: useMediaQuery
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Custom Hook: useOnlineStatus
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Custom Hook: useFormProgress
 */
export function useFormProgress<T extends Record<string, unknown>>(
  formId: string,
  initialData: T
): [T, (data: Partial<T>) => void, () => void, boolean] {
  const [data, setData] = useState<T>(initialData);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(`form_progress_${formId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Nur wiederherstellen wenn nicht aelter als 24 Stunden
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setData({ ...initialData, ...parsed.data });
          setIsRestored(true);
        }
      } catch {
        // Ungueltige Daten ignorieren
      }
    }
  }, [formId, initialData]);

  const updateData = useCallback((newData: Partial<T>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`form_progress_${formId}`, JSON.stringify({
          data: updated,
          timestamp: Date.now()
        }));
      }
      return updated;
    });
  }, [formId]);

  const clearProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`form_progress_${formId}`);
    }
    setData(initialData);
    setIsRestored(false);
  }, [formId, initialData]);

  return [data, updateData, clearProgress, isRestored];
}

/**
 * Custom Hook: useScrollPosition
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

/**
 * Custom Hook: useCountdown
 */
export function useCountdown(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return {
    ...timeLeft,
    isExpired: timeLeft.total <= 0
  };
}

function calculateTimeLeft(targetDate: Date) {
  const difference = targetDate.getTime() - Date.now();
  
  if (difference <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    total: difference,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
}
