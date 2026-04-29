'use client';

import React, { useState, useCallback } from 'react';
import { BRAND } from '../../shared/data/brand-config';
import {
  PRESS_RELEASES,
  MEDIA_KIT,
  FACTSHEET,
  PRESS_CONTACT,
  BACKGROUND_INFO,
  exportPressReleaseAsMarkdown,
} from '../data/presse-data';

export const PressePortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mitteilungen' | 'mediakit' | 'factsheet' | 'kontakt' | 'hintergrund'>('mitteilungen');
  const [selectedRelease, setSelectedRelease] = useState<typeof PRESS_RELEASES[0] | null>(null);
  const [copiedMarkdown, setCopiedMarkdown] = useState<string | null>(null);

  const handleDownloadAll = useCallback(() => {
    // Simuliere ZIP-Download
    alert('Medienkit wird als ZIP heruntergeladen...');
  }, []);

  const handleCopyMarkdown = useCallback((release: typeof PRESS_RELEASES[0]) => {
    const markdown = exportPressReleaseAsMarkdown(release);
    navigator.clipboard.writeText(markdown);
    setCopiedMarkdown(release.id);
    setTimeout(() => setCopiedMarkdown(null), 3000);
  }, []);

  const getFileIcon = (type: string) => {
    if (type === 'logo') return '🎨';
    if (type === 'image') return '📷';
    if (type === 'document') return '📄';
    if (type === 'video') return '🎬';
    return '📎';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: BRAND.colors.primary }}>
        Presseportal
      </h1>
      <p className="text-gray-600 mb-8">
        Pressemitteilungen, Medienkit und Hintergrundinformationen
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'mitteilungen', label: 'Pressemitteilungen' },
          { id: 'mediakit', label: 'Medienkit' },
          { id: 'factsheet', label: 'Factsheet' },
          { id: 'kontakt', label: 'Pressekontakt' },
          { id: 'hintergrund', label: 'Hintergrund' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pressemitteilungen */}
      {activeTab === 'mitteilungen' && (
        <div className="space-y-6">
          {selectedRelease ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <button
                onClick={() => setSelectedRelease(null)}
                className="mb-4 text-blue-600 hover:underline flex items-center gap-2"
              >
                ← Zurück zur Übersicht
              </button>

              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">
                  {selectedRelease.date.toLocaleDateString('de-DE')} • {selectedRelease.location}
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedRelease.title}</h2>
                {selectedRelease.subtitle && (
                  <p className="text-lg text-gray-600">{selectedRelease.subtitle}</p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {selectedRelease.content.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">{paragraph}</p>
                ))}
              </div>

              {selectedRelease.quotes.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold mb-4">Zitate</h3>
                  {selectedRelease.quotes.map((quote, idx) => (
                    <blockquote key={idx} className="border-l-4 border-blue-500 pl-4 italic">
                      <p className="text-lg mb-2">„{quote.text}“</p>
                      <footer className="text-sm text-gray-600">
                        — {quote.author}, {quote.position}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Pressekontakt</h3>
                <div className="text-sm">
                  <p className="font-medium">{selectedRelease.contact.name}</p>
                  <p>{selectedRelease.contact.position}</p>
                  <p>Telefon: {selectedRelease.contact.phone}</p>
                  <p>E-Mail: {selectedRelease.contact.email}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleCopyMarkdown(selectedRelease)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  {copiedMarkdown === selectedRelease.id ? '✓ Kopiert!' : 'Markdown kopieren'}
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  PDF herunterladen
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {PRESS_RELEASES.map((release) => (
                <div
                  key={release.id}
                  onClick={() => setSelectedRelease(release)}
                  className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">
                        {release.date.toLocaleDateString('de-DE')} • {release.location}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{release.title}</h3>
                      {release.subtitle && (
                        <p className="text-gray-600 text-sm">{release.subtitle}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        release.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {release.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Medienkit */}
      {activeTab === 'mediakit' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{MEDIA_KIT.name}</h2>
              <p className="text-gray-600">{MEDIA_KIT.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Letztes Update: {MEDIA_KIT.lastUpdated.toLocaleDateString('de-DE')}
              </p>
            </div>
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              📦 Alles als ZIP
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEDIA_KIT.files.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-3xl">{getFileIcon(file.type)}</div>
                <div className="flex-1">
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {file.format} • {file.size}
                  </div>
                </div>
                <a
                  href={file.downloadUrl}
                  className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Factsheet */}
      {activeTab === 'factsheet' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">{FACTSHEET.title}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {FACTSHEET.stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="font-medium text-sm mt-1">{stat.label}</div>
                {stat.description && (
                  <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {FACTSHEET.sections.map((section) => (
              <div key={section.heading} className="border-b pb-4 last:border-0">
                <h3 className="font-semibold text-lg mb-2">{section.heading}</h3>
                <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              PDF herunterladen
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Als Bild exportieren
            </button>
          </div>
        </div>
      )}

      {/* Pressekontakt */}
      {activeTab === 'kontakt' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Pressekontakt</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{PRESS_CONTACT.name}</h3>
                  <p className="text-gray-600">{PRESS_CONTACT.position}</p>
                  <p className="text-sm text-gray-500">{PRESS_CONTACT.organization}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">📞</span>
                  <div>
                    <div className="font-medium">{PRESS_CONTACT.phone}</div>
                    <div className="text-xs text-gray-500">Büro</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">📱</span>
                  <div>
                    <div className="font-medium">{PRESS_CONTACT.mobile}</div>
                    <div className="text-xs text-gray-500">Mobil</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">✉️</span>
                  <a href={`mailto:${PRESS_CONTACT.email}`} className="text-blue-600 hover:underline">
                    {PRESS_CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Erreichbarkeit:</strong> {PRESS_CONTACT.availability}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Social Media</h3>
              <div className="space-y-3">
                <a
                  href={`https://${PRESS_CONTACT.social.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded hover:shadow transition-shadow"
                >
                  <span className="text-xl">💼</span>
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`https://twitter.com/${PRESS_CONTACT.social.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded hover:shadow transition-shadow"
                >
                  <span className="text-xl">🐦</span>
                  <span>Twitter/X</span>
                </a>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">Adresse</h3>
                <address className="not-italic text-gray-600">
                  {PRESS_CONTACT.address}
                </address>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hintergrund */}
      {activeTab === 'hintergrund' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Hintergrundinformationen</h2>

          <div className="space-y-6">
            {BACKGROUND_INFO.sections.map((section) => (
              <div key={section.heading} className="border-b pb-6 last:border-0">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  📚 {section.heading}
                </h3>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PressePortal;
