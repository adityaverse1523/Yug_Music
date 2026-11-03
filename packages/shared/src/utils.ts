/**
 * Security & Data Sanitization Utilities
 */

/**
 * Validates and sanitizes external URLs to prevent XSS (e.g. javascript: URLs)
 * and malicious redirection. Strictly allows only http: and https: protocols or root-relative paths.
 */
export function sanitizeExternalUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }
  return '#';
}

/**
 * Checks whether a given string is a safe, valid external URL.
 */
export function isValidExternalUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  return /^https?:\/\//i.test(url.trim());
}

/**
 * Sanitizes plain text input by stripping dangerous script/HTML tags and trimming whitespace.
 */
export function sanitizeText(input?: string | null): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}
