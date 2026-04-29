'use client';

import React, { useState, useCallback } from 'react';
import { BRAND } from '../../shared/data/brand-config';
import { generateQRCodeDataURL } from '../../shared/utils/qr-generator';
import { 
  createApprovalWorkflow, 
  transitionWorkflow, 
  validateContent 
} from '../../shared/utils/content-approval';
import {
  FLYER_TEMPLATES,
  FLYER_CONTENTS,
  FlyerFormat,
  FlyerTheme,
  PRINT_SPECS,
} from '../data/flyer-templates';
import FlyerPreview from './FlyerPreview';

export interface GeneratedFlyer {
  id: string;
  format: FlyerFormat;
  theme: FlyerTheme;
  headline: string;
  qrCodeDataUrl: string;
  pdfUrl?: string;
  status: 'draft' | 'review' | 'published';
  createdAt: Date;
}

export const FlyerGenerator: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<FlyerFormat>('A5');
  const [selectedTheme, setSelectedTheme] = useState<FlyerTheme>('pflegegrad');
  const [customHeadline, setCustomHeadline] = useState('');
  const [showQRCode, setShowQRCode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlyers, setGeneratedFlyers] = useState<GeneratedFlyer[]>([]);
  const [workflow, setWorkflow] = useState<ReturnType<typeof createApprovalWorkflow> | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    
    const content = FLYER_CONTENTS[selectedTheme];
    const headline = customHeadline || content.headline;
    
    // Generiere QR-Code
    const qrCodeDataUrl = generateQRCodeDataURL({
      data: content.qrCodeUrl,
      size: 200,
      color: BRAND.colors.text,
      backgroundColor: BRAND.colors.white,
    });

    // Simuliere PDF-Generierung
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newFlyer: GeneratedFlyer = {
      id: `flyer-${Date.now()}`,
      format: selectedFormat,
      theme: selectedTheme,
      headline,
      qrCodeDataUrl,
      pdfUrl: `/downloads/flyer-${Date.now()}.pdf`,
      status: 'draft',
      createdAt: new Date(),
    };

    // Erstelle Workflow
    const newWorkflow = createApprovalWorkflow('flyer', newFlyer.id, 'system');
    setWorkflow(newWorkflow);
    
    setGeneratedFlyers(prev => [newFlyer, ...prev]);
    setIsGenerating(false);
  }, [selectedFormat, selectedTheme, customHeadline]);

  const handlePublish = useCallback((flyerId: string) => {
    if (!workflow) return;
    
    const updated = transitionWorkflow(workflow, 'published', 'system');
    setWorkflow(updated);
    
    setGeneratedFlyers(prev => 
      prev.map(f => f.id === flyerId ? { ...f, status: 'published' } : f)
    );
  }, [workflow]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: BRAND.colors.primary }}>
        Flyer-Generator
      </h1>
      <p className="text-gray-600 mb-8">
        Erstellen Sie professionelle Flyer im Handumdrehen
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Konfiguration */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Format wählen</h2>
            <div className="grid grid-cols-4 gap-3">
              {(['A4', 'A5', 'DL', 'A6'] as FlyerFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedFormat === format
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{format}</div>
                  <div className="text-xs text-gray-500">
                    {format === 'A4' && '210×297mm'}
                    {format === 'A5' && '148×210mm'}
                    {format === 'DL' && '210×99mm'}
                    {format === 'A6' && '105×148mm'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thema wählen</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(FLYER_CONTENTS).map(([key, content]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key as FlyerTheme)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedTheme === key
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{content.headline}</div>
                  <div className="text-xs text-gray-500 mt-1">{content.subheadline}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Anpassungen</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Eigene Überschrift (optional)
                </label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  placeholder={FLYER_CONTENTS[selectedTheme].headline}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="qrCode"
                  checked={showQRCode}
                  onChange={(e) => setShowQRCode(e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="qrCode" className="text-sm">
                  QR-Code anzeigen
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? 'Generiere Flyer...' : 'Flyer erstellen'}
          </button>
        </div>

        {/* Vorschau */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Vorschau</h2>
            <FlyerPreview
              format={selectedFormat}
              theme={selectedTheme}
              customHeadline={customHeadline || undefined}
              showQRCode={showQRCode}
            />
          </div>

          {/* Druck-Spezifikationen */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Druck-Spezifikationen</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Beschnittzugabe:</span>
                <span className="ml-2 font-medium">{PRINT_SPECS.bleed}mm</span>
              </div>
              <div>
                <span className="text-gray-500">Sicherheitsabstand:</span>
                <span className="ml-2 font-medium">{PRINT_SPECS.margin}mm</span>
              </div>
              <div>
                <span className="text-gray-500">Auflösung:</span>
                <span className="ml-2 font-medium">{PRINT_SPECS.resolution} DPI</span>
              </div>
              <div>
                <span className="text-gray-500">Farbraum:</span>
                <span className="ml-2 font-medium">{PRINT_SPECS.colorMode}</span>
              </div>
            </div>
          </div>

          {/* Generierte Flyer */}
          {generatedFlyers.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Generierte Flyer</h2>
              <div className="space-y-3">
                {generatedFlyers.map((flyer) => (
                  <div
                    key={flyer.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{flyer.headline.substring(0, 40)}...</div>
                      <div className="text-sm text-gray-500">
                        {flyer.format} • {flyer.theme} • {flyer.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          flyer.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {flyer.status === 'draft' && 'Entwurf'}
                        {flyer.status === 'review' && 'Review'}
                        {flyer.status === 'published' && 'Veröffentlicht'}
                      </span>
                      {flyer.status === 'draft' && (
                        <button
                          onClick={() => handlePublish(flyer.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Veröffentlichen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlyerGenerator;
