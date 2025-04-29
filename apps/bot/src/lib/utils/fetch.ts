export const fetcher = async <T = unknown>(url: RequestInfo, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Failed to fetch ${url} with status ${res.status}`);
  return res.json() as Promise<T>;
};
