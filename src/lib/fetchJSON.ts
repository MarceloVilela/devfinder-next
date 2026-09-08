export class HTTPError extends Error {
  status: number;

  constructor(status: number, path: string) {
    super(`Request failed: ${status} ${path}`);
    this.status = status;
  }
}

export async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, init);

  if (!res.ok) {
    throw new HTTPError(res.status, path);
  }

  return res.json() as Promise<T>;
}
