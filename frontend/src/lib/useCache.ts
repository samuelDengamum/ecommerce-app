// Simple in-memory cache for fetch requests
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchWithCache = async (url: string) => {
  const now = Date.now();
  const cached = cache.get(url);

  // Return cached data if still valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Fetch fresh data
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Store in cache
    cache.set(url, { data, timestamp: now });
    return data;
  } catch (err) {
    // If fetch fails and we have stale cache, return it
    if (cached) {
      return cached.data;
    }
    throw err;
  }
};

export const clearCache = (url?: string) => {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
};
