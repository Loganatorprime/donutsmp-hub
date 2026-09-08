import { NextRequest, NextResponse } from 'next/server'
import { createChallenge } from '@/lib/nostr'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const pubkey = request.nextUrl.searchParams.get('pubkey') ?? ''
  if (!/^[0-9a-f]{64}$/.test(pubkey)) {
    return NextResponse.json({ error: 'Invalid pubkey' }, { status: 400 })
  }
  return NextResponse.json({ challenge: createChallenge(pubkey) })
}
