import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCaseCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'PF-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function calculateCareLevel(totalScore: number): { level: number; color: string } {
  if (totalScore >= 90) return { level: 5, color: 'red' };
  if (totalScore >= 70) return { level: 4, color: 'red' };
  if (totalScore >= 50) return { level: 3, color: 'yellow' };
  if (totalScore >= 27) return { level: 2, color: 'yellow' };
  if (totalScore >= 12.5) return { level: 1, color: 'green' };
  return { level: 0, color: 'gray' };
}
