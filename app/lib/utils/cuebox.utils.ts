export async function cueboxFetch<T>(path: string): Promise<T | null> {
  const res = await fetch(`${process.env.CUEBOX_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.CUEBOX_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }).catch(() => null)

  if (!res || !res.ok) {
    return null
  }

  const json = await res.json().catch(() => null)
  return json ?? null
}
