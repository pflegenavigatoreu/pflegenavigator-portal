'use client';

import React, { useState, useCallback } from 'react';
import { BRAND } from '../../shared/data/brand-config';
import {
  SocialPlatform,
  ContentType,
  PLATFORM_FORMATS,
  BEST_POSTING_TIMES,
  CONTENT_THEMES,
  CONTENT_IDEAS,
  TIKTOK_SCRIPTS,
  LINKEDIN_ARTICLES,
  TWITTER_THREADS,
  generateContentCalendar,
  generateHashtags,
} from '../data/social-templates';

export const SocialContentGenerator: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [selectedType, setSelectedType] = useState<ContentType>('post');
  const [selectedTheme, setSelectedTheme] = useState('pflegegrad');
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [calendar, setCalendar] = useState(generateContentCalendar());
  const [activeTab, setActiveTab] = useState<'generator' | 'calendar' | 'scripts'>('generator');
  const [hashtags, setHashtags] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    // Erstelle Content basierend auf Plattform und Theme
    let content: string[] = [];
    const ideas = CONTENT_IDEAS[selectedTheme] ?? CONTENT_IDEAS['pflegegrad'];
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    
    switch (selectedPlatform) {
      case 'instagram':
        content = [
          `📋 ${randomIdea}\n\nHier sind die wichtigsten Punkte:\n✓ Punkt 1\n✓ Punkt 2\n✓ Punkt 3\n\nSwipe für mehr Infos! 👉\n\n#${selectedTheme} #Pflege #Pflegegrad #Hilfe`,
          `💙 ${randomIdea}\n\nWir helfen Ihnen dabei!\n\nLink in Bio 📲\n\n#${selectedTheme} #Pflegekraft #Wertschätzung`,
        ];
        break;
      case 'linkedin':
        content = [
          `${randomIdea}\n\nIn meiner täglichen Arbeit als Pflegeberater begegne ich immer wieder derselben Frage: Wie funktioniert das eigentlich mit dem ${selectedTheme}?\n\nHier ist meine Expertise:\n\n→ Erster Schritt: ...\n→ Zweiter Schritt: ...\n→ Dritter Schritt: ...\n\nHaben Sie Fragen? Schreiben Sie mir gerne!\n\n#${selectedTheme} #Pflege #Beratung #Expertise`,
        ];
        break;
      case 'twitter':
        content = [
          `🧵 ${randomIdea} – ein Thread\n\n1/5 Viele wissen nicht: ${selectedTheme} ist einfacher als gedacht.\n\nHier ist alles, was Sie wissen müssen 👇`,
        ];
        break;
      case 'tiktok':
        content = [
          `🎬 SKRIPT: ${randomIdea}\n\n[0-3s] Hook: "Wussten Sie, dass..."\n[3-15s] Problem erklären\n[15-30s] Lösung zeigen\n[30-45s] Call-to-Action\n\nTrending Sound + Captions aktivieren!`,
        ];
        break;
    }
    
    setGeneratedContent(content);
    setHashtags(generateHashtags(selectedTheme, 10));
  }, [selectedPlatform, selectedTheme]);

  const regenerateCalendar = useCallback(() => {
    setCalendar(generateContentCalendar());
  }, []);

  const getPlatformIcon = (platform: SocialPlatform) => {
    const icons: Record<SocialPlatform, string> = {
      instagram: '📷',
      linkedin: '💼',
      twitter: '🐦',
      tiktok: '🎵',
    };
    return icons[platform];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: BRAND.colors.primary }}>
        Social Media Content Generator
      </h1>
      <p className="text-gray-600 mb-8">
        Erstellen Sie professionelle Posts für alle Plattformen
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {(['generator', 'calendar', 'scripts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab === 'generator' && 'Content Generator'}
            {tab === 'calendar' && '30-Tage Plan'}
            {tab === 'scripts' && 'Video-Skripte'}
          </button>
        ))}
      </div>

      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Konfiguration */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Plattform wählen</h2>
              <div className="grid grid-cols-2 gap-3">
                {(['instagram', 'linkedin', 'twitter', 'tiktok'] as SocialPlatform[]).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPlatform === platform
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getPlatformIcon(platform)}</div>
                    <div className="font-medium capitalize">{platform}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Thema wählen</h2>
              <div className="grid grid-cols-2 gap-2">
                {CONTENT_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      selectedTheme === theme.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{theme.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Content generieren
            </button>

            {/* Hashtags */}
            {hashtags.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Hashtags</h2>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setHashtags(generateHashtags(selectedTheme, 15))}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  Mehr generieren
                </button>
              </div>
            )}
          </div>

          {/* Ausgabe */}
          <div className="space-y-6">
            {generatedContent.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Generierter Content</h2>
                <div className="space-y-4">
                  {generatedContent.map((content, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <pre className="whitespace-pre-wrap text-sm font-sans">{content}</pre>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(content)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Kopieren
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                        >
                          Speichern
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 p-12 rounded-lg text-center">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500">
                  Wählen Sie Plattform und Thema aus,<br />um Content zu generieren
                </p>
              </div>
            )}

            {/* Format-Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Format-Spezifikationen</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(PLATFORM_FORMATS[selectedPlatform]).map(([type, format]) => (
                  <div key={type} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium capitalize">{type}</div>
                    <div className="text-gray-600">
                      {format.width}×{format.height}px
                    </div>
                    <div className="text-gray-500">{format.aspectRatio}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">30-Tage Content-Kalender</h2>
            <button
              onClick={regenerateCalendar}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Neu generieren
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
            {calendar.map((day) => (
              <div
                key={day.day}
                className="border rounded-lg p-3 min-h-[100px] hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-400 mb-1">Tag {day.day}</div>
                <div className="flex items-center gap-1 mb-1">
                  <span>{getPlatformIcon(day.platform)}</span>
                  <span className="text-xs capitalize">{day.platform}</span>
                </div>
                <div className="text-xs text-gray-600 truncate">{day.theme}</div>
                <div className="text-xs text-blue-600 mt-1">{day.scheduledTime}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'scripts' && (
        <div className="space-y-6">
          {/* TikTok Scripts */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">🎵 TikTok Video-Skripte</h2>
            <div className="space-y-6">
              {TIKTOK_SCRIPTS.map((script) => (
                <div key={script.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{script.title}</h3>
                    <span className="text-sm text-gray-500">{script.duration}s</span>
                  </div>
                  <div className="space-y-2">
                    {script.scenes.map((scene, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <span className="text-blue-600 font-medium whitespace-nowrap">{scene.time}</span>
                        <div>
                          <div>{scene.text}</div>
                          <div className="text-gray-500 text-xs">{scene.visual}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {script.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-purple-600">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LinkedIn Articles */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">💼 LinkedIn Artikel</h2>
            {LINKEDIN_ARTICLES.map((article) => (
              <div key={article.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{article.summary}</p>
                <div className="space-y-3">
                  {article.sections.map((section, idx) => (
                    <p key={idx} className="text-sm leading-relaxed">{section}</p>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium">CTA: {article.callToAction}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Twitter Threads */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">🐦 Twitter Threads</h2>
            {TWITTER_THREADS.map((thread) => (
              <div key={thread.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{thread.title}</h3>
                <div className="space-y-3">
                  {thread.tweets.map((tweet, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded text-sm">
                      <div className="text-xs text-gray-500 mb-1">Tweet {idx + 1}/{thread.tweets.length}</div>
                      {tweet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialContentGenerator;
