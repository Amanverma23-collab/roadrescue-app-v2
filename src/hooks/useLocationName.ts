import { useState, useEffect } from 'react';

export function useLocationName(lat: number | null, lng: number | null) {
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat == null || lng == null) return;
    setLoading(true);
    const controller = new AbortController();

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { signal: controller.signal, headers: { 'Accept': 'application/json' } }
    )
      .then((r) => r.json())
      .then((data) => {
        const addr = data.address;
        const city = addr?.city || addr?.town || addr?.village || addr?.district || addr?.county || '';
        const state = addr?.state || '';
        if (city && state) setCity(`${city}, ${state}`);
        else if (city) setCity(city);
        else if (data.display_name) {
          const parts = data.display_name.split(',').slice(0, 2);
          setCity(parts.join(',').trim());
        } else setCity('');
      })
      .catch(() => setCity(''))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [lat, lng]);

  return { city, loading };
}
