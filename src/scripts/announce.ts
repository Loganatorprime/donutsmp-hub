import { finalizeEvent, SimplePool, nip19 } from 'nostr-tools'

const RELAYS = (
  process.env.NOSTR_RELAYS ||
  'wss://relay.damus.io,wss://nos.lol,wss://relay.nostr.band'
).split(',')

async function main() {
  const skEnv = process.env.NOSTR_SK
  if (!skEnv) {
    console.error(
      'Set NOSTR_SK (nsec... or hex secret key) to publish the announcement.',
    )
    process.exit(1)
  }

  const decoded = skEnv.startsWith('nsec') ? nip19.decode(skEnv) : null
  const sk: Uint8Array =
    decoded && decoded.type === 'nsec'
      ? (decoded.data as Uint8Array)
      : Uint8Array.from(Buffer.from(skEnv, 'hex'))

  const message =
    process.env.NOSTR_ANNOUNCEMENT ||
    `DonutSMP Hub is live! 🍩 Track DonutSMP prices, portfolios, predictions, trades, shops, and schematics in one place.\n\nSign in with your Nostr identity — no email or password needed.\n\n#nostr #minecraft #donutsmp`

  const event = finalizeEvent(
    {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['t', 'nostr']],
      content: message,
    },
    sk,
  )

  const pool = new SimplePool()
  const pubs = pool.publish(RELAYS, event)
  const results = await Promise.allSettled(pubs)

  const ok = results.filter((r) => r.status === 'fulfilled').length
  console.log(
    `Published ${event.id} to ${ok}/${RELAYS.length} relays as ${nip19.npubEncode(event.pubkey)}`,
  )

  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.warn(`  ${RELAYS[i]}: ${r.reason}`)
    }
  })

  pool.close(RELAYS)
}

main()
