// RTL (Right-to-Left) support utilities

export const rtlLanguages = ['ar', 'fa', 'he', 'ur', 'ps'];

export function isRTL(language: string): boolean {
  return rtlLanguages.includes(language.toLowerCase());
}

export function getTextDirection(language: string): 'ltr' | 'rtl' {
  return isRTL(language) ? 'rtl' : 'ltr';
}

// CSS class utilities for RTL
export function getRTLClasses(isRtl: boolean): string {
  return isRtl 
    ? 'rtl text-right' 
    : 'ltr text-left';
}

// Common Arabic/Persian font families that support proper rendering
export const rtlFontFamilies = [
  'Arial',
  'Tahoma',
  'Segoe UI',
  'Dubai',
  'Noto Sans Arabic',
  'Noto Naskh Arabic',
  'system-ui',
  'sans-serif'
].join(', ');

// Mirror icons when in RTL mode
export function shouldMirrorIcon(iconName: string, isRtl: boolean): boolean {
  if (!isRtl) return false;
  
  // Icons that should be mirrored in RTL
  const mirrorIcons = [
    'arrow-left', 'arrow-right',
    'chevron-left', 'chevron-right',
    'caret-left', 'caret-right',
    'angle-left', 'angle-right',
    'backspace', 'delete',
    'reply', 'forward',
    'redo', 'undo',
    'next', 'previous',
    'first', 'last'
  ];
  
  return mirrorIcons.some(icon => iconName.includes(icon));
}
