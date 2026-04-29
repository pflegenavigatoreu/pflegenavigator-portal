'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * useReducedMotion - Hook für prefers-reduced-motion Unterstützung
 * 
 * Erkennt die Systemeinstellung für reduzierte Animationen
 * und ermöglicht Animationen entsprechend anzupassen.
 * 
 * WCAG 2.1 AA Kriterium 2.2.2: Pause, Stop, Hide
 * WCAG 2.1 AA Kriterium 2.3.3: Animation from Interactions
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * 
 * return (
 *   <motion.div
 *     animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0, 1] }}
 *     transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
 *   />
 * );
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Prüfe Server-Side Rendering
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };

    // Moderne API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Legacy API für ältere Browser
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Animation Konfiguration mit Reduced Motion Unterstützung
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
}

/**
 * getAnimationStyles - Gibt CSS-Animationen basierend auf Reduced Motion Einstellung
 * 
 * @example
 * const styles = getAnimationStyles(
 *   prefersReducedMotion,
 *   { transform: 'translateX(100px)', opacity: 0 },
 *   { transform: 'translateX(0)', opacity: 1 },
 *   { duration: 300 }
 * );
 */
export function getAnimationStyles(
  prefersReducedMotion: boolean,
  from: React.CSSProperties,
  to: React.CSSProperties,
  config: AnimationConfig = {}
): { initial: React.CSSProperties; animate: React.CSSProperties } {
  const { duration = 300 } = config;

  if (prefersReducedMotion) {
    return {
      initial: { ...to, transition: 'none' },
      animate: { ...to, transition: 'none' },
    };
  }

  return {
    initial: { ...from, transition: `all ${duration}ms ease-out` },
    animate: { ...to, transition: `all ${duration}ms ease-out` },
  };
}

/**
 * useAnimation - Hook für Animationen mit Reduced Motion Unterstützung
 * 
 * @example
 * const { isAnimating, startAnimation, stopAnimation } = useAnimation({
 *   duration: 300,
 *   onComplete: () => console.log('Done')
 * });
 */
export function useAnimation(options: {
  duration?: number;
  onComplete?: () => void;
  disableOnReducedMotion?: boolean;
} = {}) {
  const { duration = 300, onComplete, disableOnReducedMotion = true } = options;
  const prefersReducedMotion = useReducedMotion();
  const [isAnimating, setIsAnimating] = useState(false);

  const shouldAnimate = !disableOnReducedMotion || !prefersReducedMotion;

  const startAnimation = useCallback(() => {
    if (!shouldAnimate) {
      onComplete?.();
      return;
    }

    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [shouldAnimate, duration, onComplete]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return {
    isAnimating,
    startAnimation,
    stopAnimation,
    prefersReducedMotion,
    shouldAnimate,
  };
}

/**
 * Animation Utility für Fade-Effekte
 */
export function useFadeAnimation(prefersReducedMotion?: boolean) {
  const reducedMotion = useReducedMotion();
  const shouldReduce = prefersReducedMotion ?? reducedMotion;

  return {
    enter: shouldReduce 
      ? { opacity: 1 } 
      : { opacity: 1, transition: 'opacity 200ms ease-out' },
    exit: shouldReduce 
      ? { opacity: 0 } 
      : { opacity: 0, transition: 'opacity 150ms ease-in' },
    instant: { opacity: 1, transition: 'none' },
  };
}

/**
 * Animation Utility für Slide-Effekte
 */
export function useSlideAnimation(direction: 'up' | 'down' | 'left' | 'right' = 'up') {
  const prefersReducedMotion = useReducedMotion();

  const getTransform = (isEntering: boolean) => {
    if (prefersReducedMotion) return 'translate3d(0, 0, 0)';
    
    const distance = isEntering ? '0' : '20px';
    const negativeDistance = isEntering ? '0' : '-20px';
    
    switch (direction) {
      case 'up': return `translate3d(0, ${isEntering ? distance : '20px'}, 0)`;
      case 'down': return `translate3d(0, ${isEntering ? distance : negativeDistance}, 0)`;
      case 'left': return `translate3d(${isEntering ? distance : '20px'}, 0, 0)`;
      case 'right': return `translate3d(${isEntering ? distance : negativeDistance}, 0, 0)`;
    }
  };

  return {
    enter: {
      transform: getTransform(true),
      opacity: 1,
      transition: prefersReducedMotion ? 'none' : 'transform 300ms ease-out, opacity 300ms ease-out',
    },
    exit: {
      transform: getTransform(false),
      opacity: 0,
      transition: prefersReducedMotion ? 'none' : 'transform 200ms ease-in, opacity 200ms ease-in',
    },
  };
}

export default useReducedMotion;
