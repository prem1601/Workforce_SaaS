import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function hasPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.some((permission) => {
    if (permission === required) return true;
    if (permission.endsWith(':*')) {
      const prefix = permission.replace(':*', '');
      return required.startsWith(`${prefix}:`);
    }
    return false;
  });
}

export const TOKEN_STORAGE_KEY = 'workforce_auth';

export function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredAuth(data: { accessToken: string; refreshToken: string; user: unknown }) {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(data));
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
