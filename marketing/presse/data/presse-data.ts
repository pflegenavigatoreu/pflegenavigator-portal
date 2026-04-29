// Presseportal Daten und Templates
import { BRAND } from '../../shared/data/brand-config';

export interface PressRelease {
  id: string;
  title: string;
  subtitle?: string;
  date: Date;
  location: string;
  content: string[];
  quotes: {
    text: string;
    author: string;
    position: string;
  }[];
  contact: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  attachments: {
    name: string;
    type: string;
    url: string;
  }[];
  status: 'draft' | 'published' | 'archived';
}

export interface MediaKit {
  id: string;
  name: string;
  description: string;
  files: {
    name: string;
    type: 'logo' | 'image' | 'document' | 'video';
    format: string;
    size: string;
    url: string;
    downloadUrl: string;
  }[];
  lastUpdated: Date;
}

export interface FactSheet {
  id: string;
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
  stats: {
    label: string;
    value: string;
    description?: string;
  }[];
}

// Pressemitteilungen
export const PRESS_RELEASES: PressRelease[] = [
  {
    id: 'pr-001',
    title: 'PflegePro startet innovative Plattform zur Unterstützung von Pflegebedürftigen',
    subtitle: 'Kostenlose Beratung und digitale Tools für Angehörige und Pflegekräfte',
    date: new Date('2026-04-15'),
    location: 'Berlin',
    content: [
      'Berlin, 15. April 2026 – PflegePro, ein neues soziales Unternehmen im Bereich Pflegeberatung, gibt heute den Start seiner umfassenden Plattform bekannt. Die Initiative verbindet persönliche Beratung mit digitalen Lösungen, um Pflegebedürftigen, Angehörigen und Pflegekräften den Alltag zu erleichtern.',
      'Die Plattform bietet kostenlose Erstberatungen, Hilfe bei Pflegegrad-Anträgen und Unterstützung bei Widersprüchen. Über 60% der Widersprüche bei Pflegegrad-Ablehnungen sind erfolgreich – doch viele Betroffene kennen ihre Rechte nicht.',
      'Mit dem digitalen Pflegeantrag (DiPA) werden Antragsverfahren erheblich beschleunigt. PflegePro begleitet Nutzer durch den gesamten Prozess und stellt sicher, dass keine Fristen verpasst werden.',
      '„Unser Ziel ist es, Wertschätzung für Pflegekräfte zu schaffen und Angehörige zu entlasten“, sagt Gründer Max Mustermann. „Pflege ist mehr als nur ein Job – es ist eine wichtige gesellschaftliche Aufgabe, die angemessene Unterstützung verdient.“',
      'Die PflegePro-App ist ab sofort im App Store und bei Google Play verfügbar.',
    ],
    quotes: [
      {
        text: 'Unser Ziel ist es, Wertschätzung für Pflegekräfte zu schaffen und Angehörige zu entlasten. Pflege ist mehr als nur ein Job – es ist eine wichtige gesellschaftliche Aufgabe.',
        author: 'Max Mustermann',
        position: 'Gründer, PflegePro',
      },
    ],
    contact: {
      name: 'Anna Schmidt',
      position: 'Pressesprecherin',
      phone: '+49 30 12345678',
      email: 'presse@pflegepro.de',
    },
    attachments: [
      { name: 'Pressemitteilung PDF', type: 'application/pdf', url: '/presse/pr-001.pdf' },
      { name: 'Gründerfoto', type: 'image/jpeg', url: '/presse/gruender.jpg' },
      { name: 'App-Screenshots', type: 'image/jpeg', url: '/presse/screenshots.zip' },
    ],
    status: 'published',
  },
  {
    id: 'pr-002',
    title: 'Neue Studie: 73% bevorzugen digitalen Pflegeantrag',
    subtitle: 'DiPA gewinnt an Akzeptanz – PflegePro unterstützt mit kostenlosem Service',
    date: new Date('2026-04-28'),
    location: 'Berlin',
    content: [
      'Berlin, 28. April 2026 – Eine aktuelle Studie von PflegePro zeigt: 73% der Pflegebedürftigen bevorzugen inzwischen den Digitalen Pflegeantrag (DiPA) gegenüber dem Papierantrag.',
      'Die Umfrage unter 1.000 Pflegebedürftigen und Angehörigen ergab, dass die Hauptvorteile von DiPA in der Zeitersparnis (84%), der einfachen Nachvollziehbarkeit (76%) und der 24/7-Verfügbarkeit (71%) liegen.',
      '„Die Digitalisierung der Pflege ist nicht mehr aufzuhalten“, sagt Studienleiterin Dr. Lisa Müller. „Doch wir brauchen weiterhin persönliche Unterstützung, um alle Menschen mitzunehmen.“',
      'PflegePro bietet kostenlose Hilfe beim DiPA-Antrag an und erreicht dabei besonders ältere Menschen und Menschen mit eingeschränkten technischen Kenntnissen.',
    ],
    quotes: [
      {
        text: 'Die Digitalisierung der Pflege ist nicht mehr aufzuhalten. Doch wir brauchen weiterhin persönliche Unterstützung, um alle Menschen mitzunehmen.',
        author: 'Dr. Lisa Müller',
        position: 'Studienleiterin, PflegePro',
      },
    ],
    contact: {
      name: 'Anna Schmidt',
      position: 'Pressesprecherin',
      phone: '+49 30 12345678',
      email: 'presse@pflegepro.de',
    },
    attachments: [
      { name: 'Studie DiPA-Akzeptanz', type: 'application/pdf', url: '/presse/studie-dipa.pdf' },
      { name: 'Infografik', type: 'image/jpeg', url: '/presse/infografik-dipa.jpg' },
    ],
    status: 'published',
  },
];

// Medienkit
export const MEDIA_KIT: MediaKit = {
  id: 'mediakit-2026',
  name: 'PflegePro Medienkit 2026',
  description: 'Offizielles Presse-Material mit Logos, Bildern und Unternehmensinformationen',
  files: [
    {
      name: 'Logo Primary (SVG)',
      type: 'logo',
      format: 'SVG',
      size: '45 KB',
      url: '/downloads/logo-primary.svg',
      downloadUrl: '/downloads/logo-primary.svg',
    },
    {
      name: 'Logo Primary (PNG)',
      type: 'logo',
      format: 'PNG',
      size: '120 KB',
      url: '/downloads/logo-primary.png',
      downloadUrl: '/downloads/logo-primary.png',
    },
    {
      name: 'Logo White (PNG)',
      type: 'logo',
      format: 'PNG',
      size: '115 KB',
      url: '/downloads/logo-white.png',
      downloadUrl: '/downloads/logo-white.png',
    },
    {
      name: 'Logo Icon (PNG)',
      type: 'logo',
      format: 'PNG',
      size: '45 KB',
      url: '/downloads/logo-icon.png',
      downloadUrl: '/downloads/logo-icon.png',
    },
    {
      name: 'Gründerfoto HQ',
      type: 'image',
      format: 'JPEG',
      size: '2.3 MB',
      url: '/downloads/gruender.jpg',
      downloadUrl: '/downloads/gruender.jpg',
    },
    {
      name: 'Teamfoto 2026',
      type: 'image',
      format: 'JPEG',
      size: '4.1 MB',
      url: '/downloads/team.jpg',
      downloadUrl: '/downloads/team.jpg',
    },
    {
      name: 'App Screenshots',
      type: 'image',
      format: 'ZIP',
      size: '8.5 MB',
      url: '/downloads/screenshots.zip',
      downloadUrl: '/downloads/screenshots.zip',
    },
    {
      name: 'Unternehmensprofil',
      type: 'document',
      format: 'PDF',
      size: '850 KB',
      url: '/downloads/unternehmensprofil.pdf',
      downloadUrl: '/downloads/unternehmensprofil.pdf',
    },
    {
      name: 'Pressemitteilungen',
      type: 'document',
      format: 'PDF',
      size: '1.2 MB',
      url: '/downloads/pressemitteilungen.pdf',
      downloadUrl: '/downloads/pressemitteilungen.pdf',
    },
  ],
  lastUpdated: new Date('2026-04-28'),
};

// Factsheet
export const FACTSHEET: FactSheet = {
  id: 'factsheet-001',
  title: 'PflegePro – Kurzprofil',
  sections: [
    {
      heading: 'Über uns',
      content: 'PflegePro ist ein soziales Unternehmen, das Pflegebedürftige, Angehörige und Pflegekräfte bei allen Fragen rund um die Pflege unterstützt. Wir verbinden persönliche Beratung mit digitalen Lösungen.',
    },
    {
      heading: 'Mission',
      content: 'Wir schaffen mehr Wertschätzung für Pflegekräfte und entlasten Angehörige durch professionelle Unterstützung bei Pflegegrad-Anträgen, Widersprüchen und dem digitalen Pflegeantrag (DiPA).',
    },
    {
      heading: 'Gründung',
      content: 'April 2026 in Berlin gegründet mit dem Ziel, die Pflegeberatung zu revolutionieren und digitale Lösungen für alle zugänglich zu machen.',
    },
    {
      heading: 'Services',
      content: '• Kostenlose Erstberatung\n• Unterstützung bei Pflegegrad-Anträgen\n• Widerspruchsbegleitung\n• DiPA-Hilfe\n• PflegePro App mit Checklisten und Erinnerungen',
    },
    {
      heading: 'Kontakt',
      content: `PflegePro GmbH\n${BRAND.contact.address}\n\nTelefon: ${BRAND.contact.phone}\nE-Mail: ${BRAND.contact.email}\nWeb: ${BRAND.urls.website}\n\nPressekontakt:\n${BRAND.contact.pressEmail}`,
    },
  ],
  stats: [
    { label: 'Beratungen', value: '10.000+', description: 'Erfolgreiche Beratungen seit Gründung' },
    { label: 'Widerspruchserfolg', value: '68%', description: 'Erfolgsquote bei Widersprüchen' },
    { label: 'App-Nutzer', value: '25.000+', description: 'Aktive Nutzer der PflegePro App' },
    { label: 'Partner', value: '50+', description: 'Kooperationspartner im Pflegebereich' },
  ],
};

// Pressekontakt
export const PRESS_CONTACT = {
  name: 'Anna Schmidt',
  position: 'Pressesprecherin',
  organization: 'PflegePro GmbH',
  address: BRAND.contact.address,
  phone: '+49 30 12345678',
  mobile: '+49 170 12345678',
  email: BRAND.contact.pressEmail,
  availability: 'Mo–Fr 9:00–18:00 Uhr',
  social: {
    linkedin: 'linkedin.com/in/anna-schmidt-pflegepro',
    twitter: '@anna_pflegepro',
  },
};

// Hintergrundinformationen
export const BACKGROUND_INFO = {
  sections: [
    {
      heading: 'Der Pflegegrad',
      content: 'Der Pflegegrad (1–5) wird vom Medizinischen Dienst (MDK) festgelegt und bestimmt die Höhe der Pflegeleistungen. Seit 2017 gibt es statt der Pflegestufen die Pflegegrade, die pflegebedürftige Menschen in fünf Kategorien einteilen.',
    },
    {
      heading: 'Widerspruch einlegen',
      content: 'Bei Ablehnung eines Pflegegrad-Antrags haben Betroffene vier Wochen Zeit, Widerspruch einzulegen. Über 60% der Widersprüche sind erfolgreich, da oft zu gering bewertet wurde.',
    },
    {
      heading: 'DiPA – Digitaler Pflegeantrag',
      content: 'Der Digitale Pflegeantrag (DiPA) ermöglicht seit 2021 die papierlose Antragstellung. Antragstellende können den Status online verfolgen und benötigen keine physischen Formulare mehr.',
    },
    {
      heading: 'Pflege in Deutschland',
      content: 'Rund 5 Millionen Menschen in Deutschland sind pflegebedürftig. Die Zahl steigt kontinuierlich an. Gleichzeitig fehlen ca. 50.000 Pflegekräfte, was zu einer Belastung von Angehörigen führt.',
    },
  ],
};

// Download-URL-Generator
export function generateDownloadUrl(filename: string): string {
  return `/downloads/${filename}`;
}

// Pressemitteilung als Markdown exportieren
export function exportPressReleaseAsMarkdown(release: PressRelease): string {
  let markdown = `# ${release.title}\n\n`;
  if (release.subtitle) {
    markdown += `**${release.subtitle}**\n\n`;
  }
  markdown += `*${release.location}, ${release.date.toLocaleDateString('de-DE')}*\n\n`;
  
  release.content.forEach((paragraph) => {
    markdown += `${paragraph}\n\n`;
  });
  
  if (release.quotes.length > 0) {
    markdown += '## Zitate\n\n';
    release.quotes.forEach((quote) => {
      markdown += `> „${quote.text}“\n>\n> — ${quote.author}, ${quote.position}\n\n`;
    });
  }
  
  markdown += '## Pressekontakt\n\n';
  markdown += `${release.contact.name}\n`;
  markdown += `${release.contact.position}\n`;
  markdown += `Telefon: ${release.contact.phone}\n`;
  markdown += `E-Mail: ${release.contact.email}\n`;
  
  return markdown;
}
