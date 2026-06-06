import type { AppData, CollectedEntry } from '../types';

const KEY = 'figurinhas_app_data';

function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) return {};
    return parsed as AppData;
  } catch {
    return {};
  }
}

function persist(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getCollection(login: string): CollectedEntry[] {
  const data = load();
  return data[login] ?? [];
}

export function addToCollection(login: string, entry: CollectedEntry): void {
  const data = load();
  if (!data[login]) data[login] = [];
  data[login].unshift(entry);
  persist(data);
}

export function getAllData(): AppData {
  return load();
}

export function clearAllData(): void {
  localStorage.removeItem(KEY);
}
