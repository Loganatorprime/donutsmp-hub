interface ServerStatus {
  online: boolean
  players?: { online: number; max: number }
  version?: string
}

export async function getServerStatus(): Promise<ServerStatus | null> {
  try {
    const res = await fetch('https://api.mcsrvstat.us/3/donutsmp.net', {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      online: Boolean(data?.online),
      players: data?.players ?? undefined,
      version: data?.version ?? undefined,
    }
  } catch {
    return null
  }
}
