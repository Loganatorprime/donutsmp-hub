import { syncPrices } from '../lib/sync'

async function main() {
  console.log('Syncing prices from DonutSMP API...')
  try {
    const result = await syncPrices()
    console.log(
      `Done. Upserted ${result.upserted} items, wrote ${result.snapshots} snapshots, resolved ${result.betsResolved} bets.`,
    )
  } catch (err) {
    console.error('Sync failed:', err)
    process.exit(1)
  }
}

main()
