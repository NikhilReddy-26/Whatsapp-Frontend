import { useEffect, useState } from 'react';
import type { LocationInfo } from '../types/crm';
import { formatLocation } from '../utils/formatLocation';
import { cachedPlace, reverseGeocode, type Place } from '../utils/reverseGeocode';

/**
 * The lead's place name as text. A typed city ("Chennai") shows as before. When the customer only
 * shared a WhatsApp pin, the name is looked up from the coordinates ("Chennai, Tamil Nadu").
 */
export function LocationLabel({ location }: { location?: LocationInfo | null }) {
  const typed = formatLocation(location, '');
  const lat = location?.lat;
  const lng = location?.lng;
  const hasPin = !typed && lat != null && lng != null;

  const [place, setPlace] = useState<Place | null | undefined>(() =>
    hasPin ? cachedPlace(lat, lng) : undefined,
  );

  useEffect(() => {
    if (!hasPin) return;
    let alive = true;
    const known = cachedPlace(lat, lng);
    if (known) {
      setPlace(known);
      return;
    }
    void reverseGeocode(lat, lng).then((p) => {
      if (alive) setPlace(p);
    });
    return () => {
      alive = false;
    };
  }, [hasPin, lat, lng]);

  if (typed) return <>{typed}</>;
  if (!hasPin) return <>Location not specified</>;
  const name = formatLocation(place, '');
  return <>{name || 'Location pinned'}</>;
}
