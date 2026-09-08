import crypto from 'node:crypto'
import { verifyEvent, nip19, type Event } from 'nostr-tools'

const CHALLENGE_TTL_SECONDS = 5 * 60
const EVENT_MAX_AGE_SECONDS = 5 * 60
export const NOSTR_AUTH_KIND = 22242

function secret(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'
}

function b64url(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url')
}

function unb64url(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8')
}

function hmac(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createChallenge(pubkey: string): string {
  const payload = JSON.stringify({
    pk: pubkey,
    nonce: crypto.randomBytes(16).toString('hex'),
    exp: Date.now() + CHALLENGE_TTL_SECONDS * 1000,
  })
  const encoded = b64url(payload)
  return `${encoded}.${hmac(encoded)}`
}

export function verifyChallenge(challenge: string, pubkey: string): boolean {
  const [encoded, sig] = challenge.split('.')
  if (!encoded || !sig) return false
  const expected = hmac(encoded)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  try {
    const payload = JSON.parse(unb64url(encoded)) as {
      pk: string
      exp: number
    }
    return payload.pk === pubkey && payload.exp > Date.now()
  } catch {
    return false
  }
}

export interface VerifiedNostrAuth {
  pubkey: string
}

export function verifyNostrAuthEvent(
  rawEvent: string,
): VerifiedNostrAuth | null {
  let event: Event
  try {
    event = JSON.parse(rawEvent) as Event
  } catch {
    return null
  }

  if (!event || typeof event !== 'object') return null
  if (event.kind !== NOSTR_AUTH_KIND) return null
  if (!/^[0-9a-f]{64}$/.test(event.pubkey ?? '')) return null
  if (!verifyEvent(event)) return null

  const now = Math.floor(Date.now() / 1000)
  if (
    typeof event.created_at !== 'number' ||
    Math.abs(now - event.created_at) > EVENT_MAX_AGE_SECONDS
  ) {
    return null
  }

  const challenge = event.tags?.find((tag) => tag[0] === 'challenge')?.[1]
  if (!challenge || !verifyChallenge(challenge, event.pubkey)) return null

  return { pubkey: event.pubkey }
}

export function displayNameForPubkey(pubkey: string): string {
  try {
    return `${nip19.npubEncode(pubkey).slice(0, 10)}…`
  } catch {
    return `${pubkey.slice(0, 8)}…`
  }
}
