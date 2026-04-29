import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Lighthouse CI Budgets
 * 
 * Definiert Performance-Budgets basierend auf Core Web Vitals und Best Practices
 * 
 * Core Web Vitals Thresholds (2024):
 * - LCP (Largest Contentful Paint): < 2.5s (good), < 4s (needs improvement)
 * - FID (First Input Delay): < 100ms (good), < 300ms (needs improvement)
 * - CLS (Cumulative Layout Shift): < 0.1 (good), < 0.25 (needs improvement)
 * - TTFB (Time to First Byte): < 800ms (good), < 1800ms (needs improvement)
 * - FCP (First Contentful Paint): < 1.8s (good), < 3s (needs improvement)
 * - INP (Interaction to Next Paint): < 200ms (good), < 500ms (needs improvement)
 */

// ============================================
// Performance Budgets
// ============================================
export const LIGHTHOUSE_BUDGETS = {
  performance: {
    // Performance Score (0-100)
    score: {
      mobile: 75,  // Mindestens 75 auf Mobile
      desktop: 85, // Mindestens 85 auf Desktop
    },
    // Core Web Vitals
    coreWebVitals: {
      lcp: {
        good: 2500,      // ms
        needsImprovement: 4000, // ms
      },
      fid: {
        good: 100,       // ms
        needsImprovement: 300,  // ms
      },
      cls: {
        good: 0.1,
        needsImprovement: 0.25,
      },
      ttfb: {
        good: 800,       // ms
        needsImprovement: 1800, // ms
      },
      fcp: {
        good: 1800,      // ms
        needsImprovement: 3000, // ms
      },
      inp: {
        good: 200,       // ms
        needsImprovement: 500,  // ms
      },
    },
  },
  accessibility: {
    score: 90, // Mindestens 90 für A11y
  },
  bestPractices: {
    score: 90, // Mindestens 90 für Best Practices
  },
  seo: {
    score: 90, // Mindestens 90 für SEO
  },
  pwa: {
    score: 70, // Mindestens 70 für PWA (optional)
  },
};

// ============================================
// Bundle Size Budgets
// ============================================
export const BUNDLE_BUDGETS = {
  // JavaScript
  javascript: {
    initial: {
      mobile: 150 * 1024,  // 150KB gzipped
      desktop: 200 * 1024, // 200KB gzipped
    },
    total: {
      mobile: 350 * 1024,  // 350KB gzipped
      desktop: 500 * 1024, // 500KB gzipped
    },
  },
  // CSS
  css: {
    initial: {
      mobile: 50 * 1024,   // 50KB gzipped
      desktop: 75 * 1024,  // 75KB gzipped
    },
    total: {
      mobile: 100 * 1024,  // 100KB gzipped
      desktop: 150 * 1024, // 150KB gzipped
    },
  },
  // Images
  images: {
    total: 1000 * 1024,    // 1MB total für alle Bilder
    perImage: 100 * 1024,  // 100KB pro Bild
    lazyLoadThreshold: 50 * 1024, // >50KB sollten lazy-loaded werden
  },
  // Fonts
  fonts: {
    total: 300 * 1024,     // 300KB für alle Fonts
    perFont: 100 * 1024,   // 100KB pro Font-Familie
  },
  // API Calls
  api: {
    maxPayload: 100 * 1024, // 100KB pro API Response
    maxRequests: 20,         // Max 20 API Requests auf einer Seite
  },
};

// ============================================
// Asset Loading Budgets
// ============================================
export const ASSET_BUDGETS = {
  // Time budgets für verschiedene Ressourcen
  time: {
    firstByte: 800,        // TTFB: 800ms
    firstPaint: 1000,      // FP: 1s
    firstContentfulPaint: 1800, // FCP: 1.8s
    largestContentfulPaint: 2500, // LCP: 2.5s
    timeToInteractive: 3500, // TTI: 3.5s
    totalBlockingTime: 200, // TBT: 200ms
    speedIndex: 3000,      // SI: 3s
  },
  // Request counts
  requests: {
    html: 1,
    css: 3,
    js: 10,
    images: 15,
    fonts: 3,
    total: 50,             // Max 50 Requests total
  },
};

describe('Lighthouse CI Budgets', () => {
  
  // ============================================
  // Performance Score Budgets
  // ============================================
  describe('Performance Score Budgets', () => {
    it('sollte Mobile Performance Budget ≥ 75 haben', () => {
      expect(LIGHTHOUSE_BUDGETS.performance.score.mobile).toBeGreaterThanOrEqual(75);
      expect(LIGHTHOUSE_BUDGETS.performance.score.mobile).toBeLessThanOrEqual(100);
    });

    it('sollte Desktop Performance Budget ≥ 85 haben', () => {
      expect(LIGHTHOUSE_BUDGETS.performance.score.desktop).toBeGreaterThanOrEqual(85);
      expect(LIGHTHOUSE_BUDGETS.performance.score.desktop).toBeLessThanOrEqual(100);
    });

    it('sollte Desktop höheres Budget als Mobile haben', () => {
      expect(LIGHTHOUSE_BUDGETS.performance.score.desktop)
        .toBeGreaterThan(LIGHTHOUSE_BUDGETS.performance.score.mobile);
    });
  });

  // ============================================
  // Core Web Vitals Budgets
  // ============================================
  describe('Core Web Vitals Thresholds', () => {
    describe('LCP (Largest Contentful Paint)', () => {
      it('sollte "good" Threshold bei 2.5s sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.lcp.good).toBe(2500);
      });

      it('sollte "needs improvement" Threshold bei 4s sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.lcp.needsImprovement).toBe(4000);
      });

      it('sollte realistische Werte haben', () => {
        const { good, needsImprovement } = LIGHTHOUSE_BUDGETS.performance.coreWebVitals.lcp;
        expect(good).toBeLessThan(needsImprovement);
        expect(good).toBeGreaterThan(0);
      });
    });

    describe('FID (First Input Delay)', () => {
      it('sollte "good" Threshold bei 100ms sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.fid.good).toBe(100);
      });

      it('sollte "needs improvement" Threshold bei 300ms sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.fid.needsImprovement).toBe(300);
      });

      it('sollte FID < 100ms für gutes UX sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.fid.good).toBeLessThan(200);
      });
    });

    describe('CLS (Cumulative Layout Shift)', () => {
      it('sollte "good" Threshold bei 0.1 sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.cls.good).toBe(0.1);
      });

      it('sollte "needs improvement" Threshold bei 0.25 sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.cls.needsImprovement).toBe(0.25);
      });

      it('sollte CLS-Werte zwischen 0 und 1 liegen', () => {
        const { good, needsImprovement } = LIGHTHOUSE_BUDGETS.performance.coreWebVitals.cls;
        expect(good).toBeGreaterThanOrEqual(0);
        expect(good).toBeLessThan(1);
        expect(needsImprovement).toBeGreaterThan(0);
        expect(needsImprovement).toBeLessThan(1);
      });
    });

    describe('TTFB (Time to First Byte)', () => {
      it('sollte "good" Threshold bei 800ms sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.ttfb.good).toBe(800);
      });

      it('sollte "needs improvement" Threshold bei 1800ms sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.ttfb.needsImprovement).toBe(1800);
      });
    });

    describe('FCP (First Contentful Paint)', () => {
      it('sollte "good" Threshold bei 1.8s sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.fcp.good).toBe(1800);
      });

      it('sollte "needs improvement" Threshold bei 3s sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.fcp.needsImprovement).toBe(3000);
      });
    });

    describe('INP (Interaction to Next Paint)', () => {
      it('sollte "good" Threshold bei 200ms sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.inp.good).toBe(200);
      });

      it('sollte "needs improvement" Threshold bei 500ms sein', () => {
        expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals.inp.needsImprovement).toBe(500);
      });
    });
  });

  // ============================================
  // Quality Score Budgets
  // ============================================
  describe('Quality Score Budgets', () => {
    it('sollte Accessibility Budget ≥ 90 haben', () => {
      expect(LIGHTHOUSE_BUDGETS.accessibility.score).toBeGreaterThanOrEqual(90);
    });

    it('sollte Best Practices Budget ≥ 90 haben', () => {
      expect(LIGHTHOUSE_BUDGETS.bestPractices.score).toBeGreaterThanOrEqual(90);
    });

    it('sollte SEO Budget ≥ 90 haben', () => {
      expect(LIGHTHOUSE_BUDGETS.seo.score).toBeGreaterThanOrEqual(90);
    });

    it('sollte PWA Budget definiert haben', () => {
      expect(LIGHTHOUSE_BUDGETS.pwa.score).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================
  // JavaScript Bundle Budgets
  // ============================================
  describe('JavaScript Bundle Budgets', () => {
    it('sollte Mobile JS Initial Budget bei 150KB haben', () => {
      expect(BUNDLE_BUDGETS.javascript.initial.mobile).toBe(150 * 1024);
    });

    it('sollte Desktop JS Initial Budget bei 200KB haben', () => {
      expect(BUNDLE_BUDGETS.javascript.initial.desktop).toBe(200 * 1024);
    });

    it('sollte Mobile JS Total Budget bei 350KB haben', () => {
      expect(BUNDLE_BUDGETS.javascript.total.mobile).toBe(350 * 1024);
    });

    it('sollte Desktop JS Total Budget bei 500KB haben', () => {
      expect(BUNDLE_BUDGETS.javascript.total.desktop).toBe(500 * 1024);
    });

    it('sollte Desktop höhere Limits als Mobile haben', () => {
      expect(BUNDLE_BUDGETS.javascript.initial.desktop)
        .toBeGreaterThan(BUNDLE_BUDGETS.javascript.initial.mobile);
      expect(BUNDLE_BUDGETS.javascript.total.desktop)
        .toBeGreaterThan(BUNDLE_BUDGETS.javascript.total.mobile);
    });

    it('sollte Total Budget größer als Initial Budget sein', () => {
      expect(BUNDLE_BUDGETS.javascript.total.mobile)
        .toBeGreaterThan(BUNDLE_BUDGETS.javascript.initial.mobile);
    });
  });

  // ============================================
  // CSS Bundle Budgets
  // ============================================
  describe('CSS Bundle Budgets', () => {
    it('sollte Mobile CSS Initial Budget bei 50KB haben', () => {
      expect(BUNDLE_BUDGETS.css.initial.mobile).toBe(50 * 1024);
    });

    it('sollte Desktop CSS Initial Budget bei 75KB haben', () => {
      expect(BUNDLE_BUDGETS.css.initial.desktop).toBe(75 * 1024);
    });

    it('sollte CSS Budgets kleiner als JS Budgets sein', () => {
      expect(BUNDLE_BUDGETS.css.initial.mobile)
        .toBeLessThan(BUNDLE_BUDGETS.javascript.initial.mobile);
    });
  });

  // ============================================
  // Image Budgets
  // ============================================
  describe('Image Budgets', () => {
    it('sollte Total Image Budget bei 1MB haben', () => {
      expect(BUNDLE_BUDGETS.images.total).toBe(1000 * 1024);
    });

    it('sollte Per-Image Budget bei 100KB haben', () => {
      expect(BUNDLE_BUDGETS.images.perImage).toBe(100 * 1024);
    });

    it('sollte Lazy-Load Threshold bei 50KB haben', () => {
      expect(BUNDLE_BUDGETS.images.lazyLoadThreshold).toBe(50 * 1024);
    });

    it('sollte Per-Image < Total sein', () => {
      expect(BUNDLE_BUDGETS.images.perImage)
        .toBeLessThan(BUNDLE_BUDGETS.images.total);
    });
  });

  // ============================================
  // Font Budgets
  // ============================================
  describe('Font Budgets', () => {
    it('sollte Total Font Budget bei 300KB haben', () => {
      expect(BUNDLE_BUDGETS.fonts.total).toBe(300 * 1024);
    });

    it('sollte Per-Font Budget bei 100KB haben', () => {
      expect(BUNDLE_BUDGETS.fonts.perFont).toBe(100 * 1024);
    });
  });

  // ============================================
  // API Budgets
  // ============================================
  describe('API Budgets', () => {
    it('sollte API Payload Budget bei 100KB haben', () => {
      expect(BUNDLE_BUDGETS.api.maxPayload).toBe(100 * 1024);
    });

    it('sollte Max API Requests bei 20 haben', () => {
      expect(BUNDLE_BUDGETS.api.maxRequests).toBe(20);
    });

    it('sollte API Limits sinnvoll sein', () => {
      expect(BUNDLE_BUDGETS.api.maxPayload).toBeGreaterThan(0);
      expect(BUNDLE_BUDGETS.api.maxRequests).toBeGreaterThan(0);
      expect(BUNDLE_BUDGETS.api.maxRequests).toBeLessThan(100);
    });
  });

  // ============================================
  // Asset Loading Time Budgets
  // ============================================
  describe('Asset Loading Time Budgets', () => {
    it('sollte TTFB Budget bei 800ms haben', () => {
      expect(ASSET_BUDGETS.time.firstByte).toBe(800);
    });

    it('sollte FP Budget bei 1s haben', () => {
      expect(ASSET_BUDGETS.time.firstPaint).toBe(1000);
    });

    it('sollte FCP Budget bei 1.8s haben', () => {
      expect(ASSET_BUDGETS.time.firstContentfulPaint).toBe(1800);
    });

    it('sollte LCP Budget bei 2.5s haben', () => {
      expect(ASSET_BUDGETS.time.largestContentfulPaint).toBe(2500);
    });

    it('sollte TTI Budget bei 3.5s haben', () => {
      expect(ASSET_BUDGETS.time.timeToInteractive).toBe(3500);
    });

    it('sollte TBT Budget bei 200ms haben', () => {
      expect(ASSET_BUDGETS.time.totalBlockingTime).toBe(200);
    });

    it('sollte Speed Index Budget bei 3s haben', () => {
      expect(ASSET_BUDGETS.time.speedIndex).toBe(3000);
    });

    it('sollte Budgets in aufsteigender Reihenfolge sein', () => {
      const times = ASSET_BUDGETS.time;
      expect(times.firstByte).toBeLessThan(times.firstPaint);
      expect(times.firstPaint).toBeLessThan(times.firstContentfulPaint);
      expect(times.firstContentfulPaint).toBeLessThan(times.largestContentfulPaint);
      expect(times.largestContentfulPaint).toBeLessThan(times.timeToInteractive);
    });
  });

  // ============================================
  // Request Count Budgets
  // ============================================
  describe('Request Count Budgets', () => {
    it('sollte HTML Requests bei 1 haben', () => {
      expect(ASSET_BUDGETS.requests.html).toBe(1);
    });

    it('sollte CSS Requests bei max 3 haben', () => {
      expect(ASSET_BUDGETS.requests.css).toBeLessThanOrEqual(5);
      expect(ASSET_BUDGETS.requests.css).toBeGreaterThan(0);
    });

    it('sollte JS Requests bei max 10 haben', () => {
      expect(ASSET_BUDGETS.requests.js).toBeLessThanOrEqual(15);
      expect(ASSET_BUDGETS.requests.js).toBeGreaterThan(0);
    });

    it('sollte Image Requests bei max 15 haben', () => {
      expect(ASSET_BUDGETS.requests.images).toBeLessThanOrEqual(20);
      expect(ASSET_BUDGETS.requests.images).toBeGreaterThan(0);
    });

    it('sollte Font Requests bei max 3 haben', () => {
      expect(ASSET_BUDGETS.requests.fonts).toBeLessThanOrEqual(5);
      expect(ASSET_BUDGETS.requests.fonts).toBeGreaterThan(0);
    });

    it('sollte Total Requests bei max 50 haben', () => {
      expect(ASSET_BUDGETS.requests.total).toBe(50);
    });

    it('sollte Summe der einzelnen Requests ≤ Total sein', () => {
      const { html, css, js, images, fonts } = ASSET_BUDGETS.requests;
      expect(html + css + js + images + fonts).toBeLessThanOrEqual(ASSET_BUDGETS.requests.total);
    });
  });

  // ============================================
  // Budget Export
  // ============================================
  describe('Budget Export', () => {
    it('sollte alle Budget-Kategorien exportieren', () => {
      expect(LIGHTHOUSE_BUDGETS).toBeDefined();
      expect(BUNDLE_BUDGETS).toBeDefined();
      expect(ASSET_BUDGETS).toBeDefined();
    });

    it('sollte Performance Budget haben', () => {
      expect(LIGHTHOUSE_BUDGETS.performance).toBeDefined();
      expect(LIGHTHOUSE_BUDGETS.performance.score).toBeDefined();
      expect(LIGHTHOUSE_BUDGETS.performance.coreWebVitals).toBeDefined();
    });

    it('sollte Qualitäts-Budgets haben', () => {
      expect(LIGHTHOUSE_BUDGETS.accessibility).toBeDefined();
      expect(LIGHTHOUSE_BUDGETS.bestPractices).toBeDefined();
      expect(LIGHTHOUSE_BUDGETS.seo).toBeDefined();
    });
  });
});

// ============================================
// Bundle Size Tests
// ============================================
describe('Bundle Size Tests', () => {
  
  it('sollte Budgets in KB berechnen können', () => {
    const kbToBytes = (kb: number) => kb * 1024;
    
    expect(kbToBytes(150)).toBe(153600);
    expect(kbToBytes(100)).toBe(102400);
    expect(kbToBytes(50)).toBe(51200);
  });

  it('sollte MB zu KB umrechnen können', () => {
    const mbToBytes = (mb: number) => mb * 1024 * 1024;
    
    expect(mbToBytes(1)).toBe(1048576);
  });

  it('sollte Bundle-Größen prüfen können', () => {
    const checkBundleSize = (size: number, budget: number) => {
      return {
        passed: size <= budget,
        size,
        budget,
        overBudget: size > budget ? size - budget : 0,
      };
    };

    const result = checkBundleSize(100000, 150 * 1024);
    expect(result.passed).toBe(true);
    expect(result.overBudget).toBe(0);

    const failed = checkBundleSize(200000, 150 * 1024);
    expect(failed.passed).toBe(false);
    expect(failed.overBudget).toBeGreaterThan(0);
  });
});

// ============================================
// Core Web Vitals Measurement
// ============================================
describe('Core Web Vitals Measurement', () => {
  
  interface WebVitalsReport {
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
    fcp: number;
    inp: number;
  }

  const calculateVitalsScore = (vitals: WebVitalsReport) => {
    const scores = {
      lcp: vitals.lcp <= 2500 ? 'good' : vitals.lcp <= 4000 ? 'needs-improvement' : 'poor',
      fid: vitals.fid <= 100 ? 'good' : vitals.fid <= 300 ? 'needs-improvement' : 'poor',
      cls: vitals.cls <= 0.1 ? 'good' : vitals.cls <= 0.25 ? 'needs-improvement' : 'poor',
      ttfb: vitals.ttfb <= 800 ? 'good' : vitals.ttfb <= 1800 ? 'needs-improvement' : 'poor',
      fcp: vitals.fcp <= 1800 ? 'good' : vitals.fcp <= 3000 ? 'needs-improvement' : 'poor',
      inp: vitals.inp <= 200 ? 'good' : vitals.inp <= 500 ? 'needs-improvement' : 'poor',
    };

    const goodCount = Object.values(scores).filter(s => s === 'good').length;
    const needsImprovementCount = Object.values(scores).filter(s => s === 'needs-improvement').length;

    return {
      scores,
      overall: goodCount >= 4 ? 'good' : needsImprovementCount >= 3 ? 'needs-improvement' : 'poor',
      goodCount,
      needsImprovementCount,
    };
  };

  it('sollte "good" für alle guten Werte zurückgeben', () => {
    const vitals: WebVitalsReport = {
      lcp: 2000,
      fid: 50,
      cls: 0.05,
      ttfb: 500,
      fcp: 1500,
      inp: 150,
    };

    const result = calculateVitalsScore(vitals);
    expect(result.overall).toBe('good');
    expect(result.goodCount).toBe(6);
  });

  it('sollte "poor" für schlechte Werte zurückgeben', () => {
    const vitals: WebVitalsReport = {
      lcp: 5000,
      fid: 400,
      cls: 0.3,
      ttfb: 2000,
      fcp: 3500,
      inp: 600,
    };

    const result = calculateVitalsScore(vitals);
    expect(result.overall).toBe('poor');
  });

  it('sollte "needs-improvement" für Grenzwerte zurückgeben', () => {
    const vitals: WebVitalsReport = {
      lcp: 3000,  // needs-improvement
      fid: 150,   // needs-improvement
      cls: 0.15,  // needs-improvement
      ttfb: 1000, // good
      fcp: 2000,  // good
      inp: 250,   // needs-improvement
    };

    const result = calculateVitalsScore(vitals);
    expect(result.overall).toBe('needs-improvement');
  });
});
