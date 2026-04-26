const fs = require('fs');
const path = require('path');

const files = [
  'gdb/diagnosen.tsx', 'gdb/start.tsx',
  'emr/arbeit.tsx', 'emr/start.tsx', 'home.tsx',
  'tagebuch/neu.tsx', 'tagebuch/uebersicht.tsx',
  'pflegegrad/modul6.tsx', 'pflegegrad/modul1.tsx', 'pflegegrad/modul3.tsx',
  'pflegegrad/modul2.tsx', 'pflegegrad/start.tsx', 'pflegegrad/ergebnis.tsx',
  'pflegegrad/modul5.tsx', 'pflegegrad/modul4.tsx',
  'sgb14/start.tsx', 'sgb14/tat.tsx',
  'widerspruch/fristen.tsx', 'widerspruch/analyse.tsx', 'widerspruch/start.tsx'
];

const baseDir = '/data/.openclaw/workspace/src/pages';

files.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace imports
  content = content.replace(
    /import\s*\{\s*useLocation\s*\}\s*from\s*['"]wouter['"]/g,
    "import { useRouter } from 'next/router'"
  );
  
  content = content.replace(
    /import\s*\{\s*Link\s*,\s*useLocation\s*\}\s*from\s*['"]wouter['"]/g,
    "import { useRouter } from 'next/router'\nimport Link from 'next/link'"
  );
  
  content = content.replace(
    /import\s*\{\s*Link\s*\}\s*from\s*['"]wouter['"]/g,
    "import Link from 'next/link'"
  );
  
  // Replace useLocation hook
  content = content.replace(
    /const\s*\[,\s*setLocation\s*\]\s*=\s*useLocation\(\)/g,
    "const router = useRouter()"
  );
  
  // Replace setLocation calls
  content = content.replace(/setLocation\(/g, 'router.push(');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${file}`);
});

console.log('Migration complete!');
