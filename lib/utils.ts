import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a valid UUID v4
 * This is a client-side UUID generator for mock mode
 * For production with Supabase, the database generates UUIDs automatically
 */
export function generateUUID(): string {
  // Use crypto.randomUUID() if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback to manual UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate if a string is a valid UUID
 * Supports UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate UUID and throw error if invalid
 * Useful for API functions that require valid UUIDs
 */
export function validateUUID(uuid: string, fieldName: string = 'ID'): void {
  if (!isValidUUID(uuid)) {
    throw new Error(`${fieldName} must be a valid UUID, got: ${uuid}`);
  }
}

/**
 * Generate a URL-friendly slug from a string
 * Example: "Kebun Sawit A" -> "kebun-sawit-a"
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Remove all non-word chars except -
    .replace(/[^\w\-]+/g, '')
    // Replace multiple - with single -
    .replace(/\-\-+/g, '-')
    // Remove - from start and end
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Check if a string is a slug or UUID
 * Returns 'slug' if it's a slug, 'uuid' if it's a UUID, or 'unknown'
 */
export function identifyIdType(id: string): 'slug' | 'uuid' | 'unknown' {
  if (isValidUUID(id)) {
    return 'uuid';
  }

  // Check if it looks like a slug (lowercase, hyphens, alphanumeric)
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (slugRegex.test(id)) {
    return 'slug';
  }

  return 'unknown';
}
