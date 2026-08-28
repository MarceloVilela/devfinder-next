export async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, init);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${path}`);
  }

  return res.json() as Promise<T>;
}
