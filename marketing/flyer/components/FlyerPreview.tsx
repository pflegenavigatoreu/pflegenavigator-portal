'use client';

import React from 'react';
import { BRAND } from '../../shared/data/brand-config';
import { FLYER_DIMENSIONS, FlyerFormat, FlyerTheme, FLYER_CONTENTS } from '../data/flyer-templates';

interface FlyerPreviewProps {
  format: FlyerFormat;
  theme: FlyerTheme;
  customHeadline?: string;
  showQRCode?: boolean;
}

export const FlyerPreview: React.FC<FlyerPreviewProps> = ({
  format,
  theme,
  customHeadline,
  showQRCode = true,
}) => {
  const content = FLYER_CONTENTS[theme];
  const dimensions = FLYER_DIMENSIONS[format];
  const headline = customHeadline || content.headline;
  
  // Skalierungsfaktor für Preview (mm zu px)
  const scale = 2;
  const widthPx = dimensions.width * scale;
  const heightPx = dimensions.height * scale;
  const isLandscape = dimensions.width > dimensions.height;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative bg-white shadow-2xl overflow-hidden"
        style={{
          width: isLandscape ? heightPx : widthPx,
          height: isLandscape ? widthPx : heightPx,
          transform: isLandscape ? 'rotate(0deg)' : undefined,
        }}
      >
        {/* Flyer Content */}
        <div className="w-full h-full flex flex-col p-4" style={{ fontFamily: BRAND.fonts.body }}>
          {/* Header */}
          <div
            className="text-white p-3 -mx-4 -mt-4 mb-3"
            style={{ backgroundColor: BRAND.colors.primary }}
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm">{BRAND.name}</div>
              <div className="text-xs opacity-80">{BRAND.tagline}</div>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-base font-bold mb-1 leading-tight"
            style={{ color: BRAND.colors.text }}
          >
            {headline}
          </h1>
          <p className="text-xs mb-2" style={{ color: BRAND.colors.secondary }}>
            {content.subheadline}
          </p>

          {/* Main Content */}
          <div className="flex-1 text-xs leading-relaxed">
            {content.mainContent.map((paragraph, idx) => (
              <p key={idx} className="mb-2" style={{ color: BRAND.colors.textLight }}>
                {paragraph}
              </p>
            ))}

            {/* Bullet Points */}
            <ul className="mt-2 space-y-1">
              {content.bulletPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: BRAND.colors.text }}
                >
                  <span style={{ color: BRAND.colors.secondary }}>✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Section */}
          <div
            className="mt-auto p-2 rounded"
            style={{ backgroundColor: BRAND.colors.background }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p
                  className="text-xs font-bold mb-1"
                  style={{ color: BRAND.colors.accent }}
                >
                  {content.callToAction}
                </p>
                <p className="text-xs" style={{ color: BRAND.colors.textLight }}>
                  {content.contactInfo.phone}
                </p>
              </div>
              
              {showQRCode && (
                <div className="w-12 h-12 bg-white p-1 rounded shadow-sm">
                  <div
                    className="w-full h-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: BRAND.colors.background }}
                  >
                    QR
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer / Disclaimer */}
          <div className="mt-2 text-[8px] leading-tight" style={{ color: BRAND.colors.textLight }}>
            {content.disclaimer}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Vorschau: {dimensions.name} | {isLandscape ? 'Querformat' : 'Hochformat'}
      </div>
    </div>
  );
};

export default FlyerPreview;
