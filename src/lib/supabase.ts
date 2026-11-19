import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'sipbanged_supabase_url';
const STORAGE_KEY_KEY = 'sipbanged_supabase_anon_key';

const DEFAULT_SUPABASE_URL = 'https://efokzwpjqskcwjtkdtzs.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_2F1agLnsUZ1P1rAx8QwO0w_XYhGW4eY';

export function getSupabaseConfig(): { url: string; anonKey: string } {
  // Check localStorage first (jika ada kustomisasi manual di UI), lalu env, lalu default
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: localUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: localKey || envKey || DEFAULT_SUPABASE_ANON_KEY
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);
  }
}

let supabaseInstance: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export function getSupabase(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  if (!supabaseInstance || currentUrl !== config.url || currentKey !== config.anonKey) {
    currentUrl = config.url;
    currentKey = config.anonKey;
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
    }
  }

  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

