const requestCache = new Map();

function getCacheKey(url, options) {
  const authorization = options.headers?.Authorization || "";
  return `${url}::${authorization}`;
}

export async function fetchJsonCached(url, options = {}) {
  const key = getCacheKey(url, options);
  const cached = requestCache.get(key);

  if (cached) {
    return cached;
  }

  const promise = fetch(url, options).then(async (response) => {
    if (!response.ok) {
      const error = new Error(`Request failed (${response.status}).`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  });

  requestCache.set(key, promise);

  try {
    return await promise;
  } catch (error) {
    if (requestCache.get(key) === promise) {
      requestCache.delete(key);
    }
    throw error;
  }
}

export function invalidateRequestCache(urlFragment) {
  for (const key of requestCache.keys()) {
    if (key.includes(urlFragment)) {
      requestCache.delete(key);
    }
  }
}

export function clearRequestCache() {
  requestCache.clear();
}
