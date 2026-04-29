'use client';

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Kontext für Screen Reader Ankündigungen
type A11yAnnouncerContextType = {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  announceRouteChange: (pageName: string) => void;
  announceProgress: (message: string, progress?: number) => void;
};

const A11yAnnouncerContext = createContext<A11yAnnouncerContextType | undefined>(undefined);

interface A11yAnnouncerProviderProps {
  children: React.ReactNode;
}

/**
 * useA11yAnnouncer - Hook für Screen Reader Ankündigungen
 * 
 * @example
 * const { announce, announceRouteChange, announceProgress } = useA11yAnnouncer();
 * 
 * // Einfache Ankündigung
 * announce('Formular erfolgreich gesendet');
 * 
 * // Route-Change Ankündigung
 * announceRouteChange('Barrierefreiheit');
 * 
 * // Fortschritts-Ankündigung
 * announceProgress('Datei wird hochgeladen', 75);
 */
export function useA11yAnnouncer() {
  const context = useContext(A11yAnnouncerContext);
  if (!context) {
    throw new Error('useA11yAnnouncer must be used within A11yAnnouncerProvider');
  }
  return context;
}

/**
 * A11yAnnouncerProvider - WCAG 2.1 AA konforme Screen Reader Ankündigungen
 * 
 * Bietet aria-live Regionen für:
 * - "polite" Ankündigungen (nicht unterbrechend)
 * - "assertive" Ankündigungen (unterbrechend, für Fehler)
 * - Route-Changes
 * - Fortschritts-Updates
 * 
 * @example
 * <A11yAnnouncerProvider>
 *   <App />
 * </A11yAnnouncerProvider>
 */
export function A11yAnnouncerProvider({ children }: A11yAnnouncerProviderProps) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const [progressMessage, setProgressMessage] = useState('');

  // Ankündigung mit Debounce für Screen Reader Kompatibilität
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
      // Kurze Verzögerung für NVDA/JAWS
      setTimeout(() => setAssertiveMessage(message), 100);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 100);
    }
  }, []);

  // Route-Change Ankündigung
  const announceRouteChange = useCallback((pageName: string) => {
    announce(`Seite geladen: ${pageName}`, 'polite');
  }, [announce]);

  // Fortschritts-Ankündigung
  const announceProgress = useCallback((message: string, progress?: number) => {
    const progressText = progress !== undefined ? `, ${Math.round(progress)} Prozent abgeschlossen` : '';
    announce(`${message}${progressText}`, 'polite');
    setProgressMessage(`${message}${progressText}`);
  }, [announce]);

  // Automatische Bereinigung nach Ankündigung
  useEffect(() => {
    if (politeMessage) {
      const timer = setTimeout(() => setPoliteMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [politeMessage]);

  useEffect(() => {
    if (assertiveMessage) {
      const timer = setTimeout(() => setAssertiveMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [assertiveMessage]);

  const value: A11yAnnouncerContextType = {
    announce,
    announceRouteChange,
    announceProgress,
  };

  return (
    <A11yAnnouncerContext.Provider value={value}>
      {children}
      {/* aria-live Regionen - visuell ausgeblendet aber für Screen Reader zugänglich */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
      <div
        role="progressbar"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {progressMessage}
      </div>
    </A11yAnnouncerContext.Provider>
  );
}

/**
 * LiveRegion - Direkte aria-live Region für spezifische Anwendungsfälle
 */
interface LiveRegionProps {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  className?: string;
}

export function LiveRegion({ children, priority = 'polite', className }: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className={cn(className)}
    >
      {children}
    </div>
  );
}

export default A11yAnnouncerProvider;
