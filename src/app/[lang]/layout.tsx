export async function generateStaticParams() {
  // Generate all 35 language paths
  const languages = [
    'de', 'en', 'tr', 'pl', 'ru', 'it', 'es', 'fr', 'ar', 'fa',
    'bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'el', 'hu', 'ga',
    'lv', 'lt', 'mt', 'no', 'pt', 'ro', 'sk', 'sl', 'sv', 'uk',
    'sr', 'mk', 'sq', 'bs', 'is'
  ];
  
  return languages.map((lang) => ({
    lang: lang,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // Await params as per Next.js 16 requirements
  await params;
  return children;
}
