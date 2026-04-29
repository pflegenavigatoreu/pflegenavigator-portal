'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * useFocusRing - Hook für :focus-visible Styling
 * 
 * Erkennt ob der Benutzer mit Tastatur navigiert (focus-visible)
 * und fügt entsprechende Klassen hinzu.
 * 
 * Unterstützt auch :focus-within für Gruppen.
 * 
 * @example
 * const { isFocusVisible, focusProps } = useFocusRing();
 * 
 * return (
 *   <button {...focusProps} className={cn(
 *     'base-styles',
 *     isFocusVisible && 'ring-2 ring-emerald-500 ring-offset-2'
 *   )}>
 *     Click me
 *   </button>
 * );
 */
export function useFocusRing() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback((e: React.FocusEvent) => {
    setIsFocused(true);
    // focus-visible wird durch CSS-Klasse "focus-visible" erkannt
    // oder durch Tastatur-Interaktion
    setIsFocusVisible(true);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent) => {
    setIsFocused(false);
    setIsFocusVisible(false);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Maus-Klick: Kein focus-visible
    setIsFocusVisible(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Tastatur: focus-visible
    if (e.key === 'Tab' || e.key.startsWith('Arrow')) {
      setIsFocusVisible(true);
    }
  }, []);

  const focusProps = {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onPointerDown: handlePointerDown,
    onKeyDown: handleKeyDown,
  };

  return {
    isFocusVisible,
    isFocused,
    focusProps,
  };
}

/**
 * useFocusRingGlobal - Globaler Focus-Visible State
 * 
 * Fügt CSS-Klassen zum HTML-Element hinzu basierend auf
 * der Eingabemethode (Tastatur vs. Maus).
 */
export function useFocusRingGlobal() {
  const [keyboardMode, setKeyboardMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardMode(true);
        document.documentElement.classList.add('focus-visible-mode');
        document.documentElement.classList.remove('pointer-mode');
      }
    };

    const handlePointerDown = () => {
      setKeyboardMode(false);
      document.documentElement.classList.remove('focus-visible-mode');
      document.documentElement.classList.add('pointer-mode');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return keyboardMode;
}

/**
 * useFocusWithin - Hook für :focus-within auf Container-Ebene
 * 
 * @example
 * const { isFocusWithin, focusWithinProps } = useFocusWithin();
 * 
 * return (
 *   <div {...focusWithinProps} className={cn(
 *     'group',
 *     isFocusWithin && 'ring-2 ring-emerald-500'
 *   )}>
 *     <input type="text" />
 *   </div>
 * );
 */
export function useFocusWithin() {
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  const handleFocusIn = useCallback((e: React.FocusEvent) => {
    setIsFocusWithin(true);
  }, []);

  const handleFocusOut = useCallback((e: React.FocusEvent) => {
    // Prüfe ob Fokus noch innerhalb des Containers ist
    const container = e.currentTarget;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    if (!container.contains(relatedTarget)) {
      setIsFocusWithin(false);
    }
  }, []);

  const focusWithinProps = {
    onFocus: handleFocusIn,
    onBlur: handleFocusOut,
  };

  return {
    isFocusWithin,
    focusWithinProps,
  };
}

/**
 * Focus Ring CSS Utilities
 * 
 * Diese Klassen können direkt in Tailwind oder CSS verwendet werden:
 * 
 * .focus-ring {
 *   @apply focus-visible:outline-none focus-visible:ring-2 
 *          focus-visible:ring-emerald-500 focus-visible:ring-offset-2;
 * }
 * 
 * .focus-ring-error {
 *   @apply focus-visible:outline-none focus-visible:ring-2 
 *          focus-visible:ring-red-500 focus-visible:ring-offset-2;
 * }
 */
export const focusRingClasses = {
  default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
  error: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
  warning: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
  info: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
};

export default useFocusRing;
