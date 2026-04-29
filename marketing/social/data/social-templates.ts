// Social Media Content Templates
import { BRAND } from '../../shared/data/brand-config';

export type SocialPlatform = 'instagram' | 'tiktok' | 'linkedin' | 'twitter';
export type ContentType = 'post' | 'story' | 'reel' | 'article' | 'thread';

export interface SocialTemplate {
  id: string;
  platform: SocialPlatform;
  contentType: ContentType;
  format: {
    width: number;
    height: number;
    aspectRatio: string;
    name: string;
  };
  maxLength?: number;
  maxCharacters?: number;
  hashtags: number;
  features: string[];
}

export interface ContentCalendarDay {
  day: number;
  platform: SocialPlatform;
  contentType: ContentType;
  theme: string;
  scheduledTime: string;
  status: 'planned' | 'ready' | 'scheduled' | 'published';
}

// Plattform-Formate
export const PLATFORM_FORMATS: Record<SocialPlatform, Record<ContentType, SocialTemplate['format']>> = {
  instagram: {
    post: { width: 1080, height: 1080, aspectRatio: '1:1', name: 'Quadrat' },
    story: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Story' },
    reel: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Reel' },
    article: { width: 1080, height: 1350, aspectRatio: '4:5', name: 'Carousel' },
    thread: { width: 1080, height: 1080, aspectRatio: '1:1', name: 'Quadrat' },
  },
  tiktok: {
    post: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'TikTok Video' },
    story: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Story' },
    reel: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Video' },
    article: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Video' },
    thread: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Video' },
  },
  linkedin: {
    post: { width: 1200, height: 627, aspectRatio: '1.91:1', name: 'LinkedIn Post' },
    story: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Story' },
    reel: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Video' },
    article: { width: 1200, height: 800, aspectRatio: '3:2', name: 'Article' },
    thread: { width: 1200, height: 627, aspectRatio: '1.91:1', name: 'Post' },
  },
  twitter: {
    post: { width: 1200, height: 675, aspectRatio: '16:9', name: 'Tweet' },
    story: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Fleets' },
    reel: { width: 1080, height: 1920, aspectRatio: '9:16', name: 'Video' },
    article: { width: 1200, height: 675, aspectRatio: '16:9', name: 'Long-form' },
    thread: { width: 1200, height: 675, aspectRatio: '16:9', name: 'Thread' },
  },
};

// Beste Posting-Zeiten
export const BEST_POSTING_TIMES: Record<SocialPlatform, string[]> = {
  instagram: ['08:00', '12:00', '18:00', '20:00'],
  tiktok: ['07:00', '12:00', '19:00', '21:00'],
  linkedin: ['08:00', '12:00', '17:00'],
  twitter: ['08:00', '12:00', '17:00', '19:00'],
};

// Themen für Content
export const CONTENT_THEMES = [
  { id: 'pflegegrad', name: 'Pflegegrad-Info', hashtags: ['#Pflegegrad', '#Pflege', '#MDK', '#Pflegebedarf'] },
  { id: 'widerspruch', name: 'Widerspruchs-Tipps', hashtags: ['#Widerspruch', '#Pflegeversicherung', '#Rechte', '#Beratung'] },
  { id: 'dipa', name: 'DiPA Updates', hashtags: ['#DiPA', '#Digital', '#Pflegeantrag', '#Modern'] },
  { id: 'motivation', name: 'Motivation Pflege', hashtags: ['#Pflegekraft', '#Danke', '#Wertschätzung', '#Pflegenotstand'] },
  { id: 'recht', name: 'Rechtliches', hashtags: ['#Recht', '#Gesetz', '#Pflegerecht', '#Beratung'] },
  { id: 'alltag', name: 'Pflege-Alltag', hashtags: ['#PflegeAlltag', '#Hilfe', '#Tipps', '#Leben'] },
  { id: 'finanzierung', name: 'Finanzierung', hashtags: ['#Kosten', '#Pflegegeld', '#Zuschuss', '#Finanzen'] },
  { id: 'angehoerige', name: 'Für Angehörige', hashtags: ['#Angehörige', '#Familie', '#Unterstützung', '#Liebe'] },
];

// Post-Vorlagen
export const POST_TEMPLATES: Record<SocialPlatform, Record<ContentType, string[]>> = {
  instagram: {
    post: [
      '📋 {headline}\n\n{content}\n\n{cta}\n\n{hashtags}',
      '💙 {headline}\n\n{content}\n\nSwipe für mehr Infos 👉\n\n{hashtags}',
      '✨ Wussten Sie, dass...\n\n{content}\n\n{cta}\n\n{hashtags}',
    ],
    story: [
      '{content}',
      '📢 {headline}\n\n{content}',
    ],
    reel: [
      '{hook}\n\n{content}\n\n{cta}',
    ],
    article: [
      '{headline}\n\n{intro}\n\n{points}\n\n{conclusion}\n\n{cta}\n\n{hashtags}',
    ],
    thread: [
      '{headline}\n\n{content}\n\n{hashtags}',
    ],
  },
  tiktok: {
    post: ['{hook} {content} {cta}'],
    story: ['{content}'],
    reel: ['{hook} {content} {cta}'],
    article: ['{hook} {content} {cta}'],
    thread: ['{hook} {content} {cta}'],
  },
  linkedin: {
    post: [
      '{headline}\n\n{content}\n\n{cta}\n\n{hashtags}',
    ],
    story: ['{content}'],
    reel: ['{content}'],
    article: [
      '# {headline}\n\n## Einleitung\n\n{intro}\n\n## Hauptteil\n\n{content}\n\n## Fazit\n\n{conclusion}\n\n{cta}',
    ],
    thread: ['{content}'],
  },
  twitter: {
    post: ['{content}\n\n{hashtags}'],
    story: ['{content}'],
    reel: ['{content}'],
    article: ['{content}\n\n{hashtags}'],
    thread: [
      '🧵 {headline}\n\n1/{count} {firstTweet}',
    ],
  },
};

// Content-Ideen
export const CONTENT_IDEAS: Record<string, string[]> = {
  pflegegrad: [
    '5 Dinge, die Sie über den Pflegegrad wissen müssen',
    'Pflegegrad 1-5: Was bedeuten die Stufen?',
    'So bereiten Sie sich auf den MDK-Besuch vor',
    'Pflegegrad abgelehnt? Das können Sie tun',
    'Checkliste: Pflegegrad-Antrag richtig ausfüllen',
  ],
  widerspruch: [
    'Widerspruch erfolgreich einlegen: Schritt für Schritt',
    'Diese Fehler sollten Sie beim Widerspruch vermeiden',
    'Wie lange dauert ein Widerspruch?',
    'Widerspruch eingereicht – was passiert jetzt?',
    '60% Erfolgsquote: Lohnt sich ein Widerspruch?',
  ],
  dipa: [
    'DiPA: Pflegeantrag digital stellen',
    'Vorteile von DiPA gegenüber Papierantrag',
    'DiPA-Checkliste: Was Sie brauchen',
    'DiPA Schritt für Schritt erklärt',
  ],
  motivation: [
    'Danke an alle Pflegekräfte 💙',
    'Ein Tag im Leben einer Pflegekraft',
    'Warum Pflege mehr als nur ein Job ist',
    'Pflegekraft des Monats: {name}',
  ],
};

// TikTok-Skripte
export const TIKTOK_SCRIPTS = [
  {
    id: 'pflegegrad-1',
    title: 'Pflegegrad in 60 Sekunden',
    duration: 60,
    scenes: [
      { time: '0-3s', text: 'Wussten Sie, dass Sie Anspruch auf Pflegeleistungen haben?', visual: 'Text auf Bild' },
      { time: '3-15s', text: 'Der Pflegegrad wird vom MDK festgelegt und reicht von 1 bis 5.', visual: 'Grafik mit Stufen' },
      { time: '15-30s', text: 'Je höher der Grad, desto mehr Leistungen bekommen Sie.', visual: 'Vergleichstabelle' },
      { time: '30-45s', text: 'So beantragen Sie den Pflegegrad...', visual: 'Schritte zeigen' },
      { time: '45-60s', text: 'Link in Bio für kostenlose Beratung!', visual: 'Call-to-Action' },
    ],
    music: 'Trending, motivierend',
    captions: true,
    hashtags: ['#Pflegegrad', '#Pflege', '#MDK', '#Hilfe', '#Wissen'],
  },
  {
    id: 'widerspruch-1',
    title: 'Widerspruch erfolgreich einlegen',
    duration: 45,
    scenes: [
      { time: '0-5s', text: 'Pflegegrad abgelehnt? Nicht aufgeben!', visual: 'Empathisches Bild' },
      { time: '5-20s', text: 'Sie haben 4 Wochen Zeit für einen Widerspruch.', visual: 'Kalender-Grafik' },
      { time: '20-35s', text: 'Über 60% der Widersprüche sind erfolgreich!', visual: 'Statistik einblenden' },
      { time: '35-45s', text: 'Wir helfen Ihnen kostenlos. Link in Bio!', visual: 'CTA mit QR' },
    ],
    music: 'Hoffnungsvoll, aufmunternd',
    captions: true,
    hashtags: ['#Widerspruch', '#Pflegeversicherung', '#Hilfe', '#Recht', '#Beratung'],
  },
];

// LinkedIn-Artikel
export const LINKEDIN_ARTICLES = [
  {
    id: 'linkedin-1',
    title: 'Die Zukunft der digitalen Pflege: Was DiPA wirklich bedeutet',
    summary: 'DiPA revolutioniert den Pflegeantrag. Doch was bedeutet das für Pflegebedürftige und Angehörige?',
    sections: [
      'Die Pflegebranche befindet sich im Wandel. Mit dem Digitalen Pflegeantrag (DiPA) wird ein lang ersehnter Wunsch wahr: endlich papierlos und unkompliziert Pflegeleistungen beantragen.',
      'Doch der Übergang ist nicht trivial. Viele Pflegebedürftige kennen die Vorteile von DiPA noch nicht oder scheuen die vermeintliche technische Hürde.',
      'Als Experte für Pflegeberatung beobachte ich täglich, wie DiPA den Prozess beschleunigt. Statt Wochen dauert die Antragstellung nun nur Minuten.',
      'Die Zahlen sprechen für sich: 73% unserer Klienten bevorzugen inzwischen den digitalen Weg.',
    ],
    callToAction: 'Möchten Sie mehr über DiPA erfahren? Kontaktieren Sie mich für ein kostenloses Erstgespräch.',
    hashtags: ['#Pflege', '#DiPA', '#Digitalisierung', '#Pflegeberatung'],
  },
];

// Twitter/X Threads
export const TWITTER_THREADS = [
  {
    id: 'thread-1',
    title: 'Alles über Pflegegrad-Antrag',
    tweets: [
      '🧵 Pflegegrad beantragen – ein Thread.\n\nViele wissen nicht: Sie haben Anspruch auf Pflegeleistungen. Doch der Antrag kann kompliziert sein.\n\nHier ist alles, was Sie wissen müssen. 👇',
      '1️⃣ Wer kann beantragen?\n\n• Pflegebedürftige selbst\n• Angehörige\n• Betreuer\n• Pflegekräfte (mit Vollmacht)\n\nWichtig: Sie brauchen eine ärztliche Behandlung mit Verdacht auf Pflegebedürftigkeit.',
      '2️⃣ Was wird geprüft?\n\nDer Medizinische Dienst (MDK) bewertet:\n• Körperpflege\n• Ernährung\n• Mobilität\n• Hauswirtschaftliche Versorgung\n\nJeder Bereich bringt Punkte.',
      '3️⃣ Die Pflegestufen:\n\n• Grad 1: 12,5-17 Punkte\n• Grad 2: 17-27,5 Punkte\n• Grad 3: 27,5-45 Punkte\n• Grad 4: 45-55 Punkte\n• Grad 5: ab 55 Punkte',
      '4️⃣ Wie lange dauert es?\n\n• Antragstellung: Sofort\n• MDK-Besuch: ca. 2-4 Wochen\n• Bescheid: ca. 5-7 Wochen\n\nInsgesamt: ca. 2 Monate',
      '5️⃣ Was bei Ablehnung?\n\n→ Widerspruch einlegen!\n\n• Frist: 4 Wochen\n• Erfolgsquote: über 60%\n• Kostenlos möglich\n\nLohnt sich fast immer.',
      '6️⃣ Nächste Schritte:\n\n✅ Checkliste downloaden\n✅ Termin vereinbaren\n✅ Kostenlose Beratung\n\nWir helfen bei jedem Schritt.\n\nLink in der Bio oder DM me! 💙',
    ],
  },
];

// 30-Tage Content-Kalender Generator
export function generateContentCalendar(startDate: Date = new Date()): ContentCalendarDay[] {
  const calendar: ContentCalendarDay[] = [];
  const platforms: SocialPlatform[] = ['instagram', 'linkedin', 'tiktok', 'twitter'];
  const themes = CONTENT_THEMES;
  
  for (let day = 1; day <= 30; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day - 1);
    
    // Rotiere Plattformen
    const platform = platforms[day % platforms.length];
    
    // Wähle Content-Typ basierend auf Plattform
    let contentType: ContentType = 'post';
    if (platform === 'tiktok') contentType = 'reel';
    if (platform === 'linkedin' && day % 3 === 0) contentType = 'article';
    if (platform === 'twitter' && day % 4 === 0) contentType = 'thread';
    
    // Wähle Theme
    const theme = themes[day % themes.length];
    
    // Wähle beste Posting-Zeit
    const postingTimes = BEST_POSTING_TIMES[platform];
    const timeIndex = (day + Math.floor(Math.random() * postingTimes.length)) % postingTimes.length;
    
    calendar.push({
      day,
      platform,
      contentType,
      theme: theme.name,
      scheduledTime: postingTimes[timeIndex],
      status: 'planned',
    });
  }
  
  return calendar;
}

// Hashtag-Generator
export function generateHashtags(theme: string, count: number = 15): string[] {
  const baseHashtags = ['#Pflege', '#Pflegegrad', '#DiPA', '#WirPflegen', '#Pflegekraft'];
  
  const themeHashtags: Record<string, string[]> = {
    'Pflegegrad-Info': ['#Pflegegrad', '#MDK', '#Bewertung', '#Antrag', '#Leistungen'],
    'Widerspruchs-Tipps': ['#Widerspruch', '#Ablehnung', '#Recht', '#Erfolg', '#Hilfe'],
    'DiPA Updates': ['#DiPA', '#Digital', '#Online', '#Modern', '#Einfach'],
    'Motivation Pflege': ['#Danke', '#Wertschätzung', '#Pflegenotstand', '#Helden', '#Motivation'],
    'Rechtliches': ['#Recht', '#Gesetz', '#Pflegerecht', '#SGB', '#Beratung'],
    'Pflege-Alltag': ['#PflegeAlltag', '#Tipps', '#Tricks', '#Hacks', '#Alltag'],
    'Finanzierung': ['#Kosten', '#Pflegegeld', '#Zuschuss', '#Finanzen', '#Geld'],
    'Für Angehörige': ['#Angehörige', '#Familie', '#Unterstützung', '#Zuhause', '#Liebe'],
  };
  
  const specific = themeHashtags[theme] ?? [];
  const all = [...baseHashtags, ...specific];
  
  // Shuffle und begrenze
  return all.sort(() => Math.random() - 0.5).slice(0, count);
}
