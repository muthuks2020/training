/**
 * utils/helpers.js
 * ----------------
 * General-purpose helper utilities.
 */

/**
 * Format a datetime string for display.
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

/**
 * Truncate text to a given length.
 */
export function truncate(text, maxLen = 40) {
  if (!text) return '—';
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

/**
 * Build a display label from a value.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extract a clean error message from an API error.
 */
export function getErrorMessage(error) {
  if (!error) return 'An unknown error occurred.';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'An unexpected error occurred.';
}

/**
 * Delay utility (for loading state UX).
 */
export function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
