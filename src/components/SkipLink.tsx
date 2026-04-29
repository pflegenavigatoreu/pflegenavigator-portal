"use client";

import React from "react";

interface SkipLinkProps {
  /** ID des Hauptinhalts zum Springen */
  targetId?: string;
  /** Label für Screenreader */
  label?: string;
}

/**
 * Skip-Link Komponente für Barrierefreiheit
 * Ermöglicht Screenreadern und Tastaturbenutzern, direkt zum Hauptinhalt zu springen
 * 
 * @example
 * ```tsx
 * <SkipLink targetId="main-content" />
 * <main id="main-content">...</main>
 * ```
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = "main-content",
  label = "Zum Hauptinhalt springen",
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 focus:z-[100] focus:bg-white focus:text-[#0f2744] 
                 focus:px-4 focus:py-3 focus:rounded-lg focus:shadow-lg
                 focus:ring-2 focus:ring-[#20b2aa] focus:outline-none
                 focus:font-medium focus:no-underline
                 transition-all duration-200"
      aria-label={label}
    >
      {label}
    </a>
  );
};

export default SkipLink;
