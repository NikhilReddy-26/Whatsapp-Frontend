/** Join city/state for display, skipping blanks so we never render a bare "," */
export function formatLocation(
  location?: { city?: string | null; state?: string | null } | null,
  fallback = 'Location not specified',
): string {
  const parts = [location?.city, location?.state]
    .map((p) => (p ?? '').trim())
    .filter((p) => p.length > 0 && p !== ',');
  return parts.length > 0 ? parts.join(', ') : fallback;
}
