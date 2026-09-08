export interface NostrEvent {
  id?: string
  pubkey?: string
  created_at?: number
  kind?: number
  tags?: string[][]
  content?: string
  sig?: string
}

export interface Nostr {
  getPublicKey(): Promise<string>
  signEvent(event: NostrEvent): Promise<NostrEvent>
}

declare global {
  interface Window {
    nostr?: Nostr
  }
}

export {}
