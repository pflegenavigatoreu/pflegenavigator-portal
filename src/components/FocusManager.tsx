"use client";

import React, { useEffect, useCallback } from "react";

interface FocusManagerProps {
  children: React.ReactNode;
  /** Ob Fokus-Trapping aktiviert sein soll (z.B. für Modals) */
  trapFocus?: boolean;
  /** Ref zum Container-Element für Focus Trap */
  containerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Focus Manager für Barrierefreiheit
 * Verwaltet Fokus-Indikatoren und Focus-Trapping
 * 
 * @example
 * ```tsx
 * <FocusManager trapFocus={isOpen} containerRef={modalRef}>
 *   <ModalContent />
 * </FocusManager>
 * ```
 */
export const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  trapFocus = false,
  containerRef,
}) => {
  /**
   * Focus-Trap Logik für Modals und Dialoge
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!trapFocus || !containerRef?.current) return;

    if (e.key === "Tab") {
      const container = containerRef.current;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift+Tab: Rückwärts
        if (activeElement === firstElement || !container.contains(activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Vorwärts
        if (activeElement === lastElement || !container.contains(activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    if (e.key === "Escape" && trapFocus) {
      // ESC schließt Modal - muss vom Parent gehandelt werden
      // Hier nur als Accessibility-Hinweis
    }
  }, [trapFocus, containerRef]);

  useEffect(() => {
    if (trapFocus) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown, trapFocus]);

  return <>{children}</>;
};

/**
 * Hook für Fokus-Management
 */
export const useFocusManager = () => {
  /**
   * Setzt Fokus auf ein Element mit Delay (für Animationen)
   */
  const focusWithDelay = useCallback((element: HTMLElement | null, delay = 100) => {
    if (!element) return;
    setTimeout(() => element.focus(), delay);
  }, []);

  /**
   * Speichert und restored Fokus
   */
  const useFocusRestore = () => {
    const savedFocus = React.useRef<HTMLElement | null>(null);

    const saveFocus = useCallback(() => {
      savedFocus.current = document.activeElement as HTMLElement;
    }, []);

    const restoreFocus = useCallback(() => {
      if (savedFocus.current) {
        savedFocus.current.focus();
      }
    }, []);

    return { saveFocus, restoreFocus };
  };

  return { focusWithDelay, useFocusRestore };
};

export default FocusManager;
