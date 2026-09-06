'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'

export function ShardCalculator() {
  const [hours, setHours] = useState('12')
  const [kills, setKills] = useState('0')
  const [price, setPrice] = useState('100')
  const [result, setResult] = useState<{
    shards: number
    spawners: number
    left: number
  } | null>(null)

  function calculate() {
    const h = Math.max(0, Number(hours) || 0)
    const k = Math.max(0, Number(kills) || 0)
    const p = Math.max(1, Number(price) || 1)
    const shards = Math.floor(h * 60) + Math.floor(k * 10)
    const spawners = Math.floor(shards / p)
    setResult({ shards, spawners, left: shards % p })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Hours in the AFK zone
          </label>
          <Input
            type="number"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            1 shard per minute while AFK
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Player kills</label>
          <Input
            type="number"
            min="0"
            value={kills}
            onChange={(e) => setKills(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">10 shards per kill</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Spawner cost (shards)
          </label>
          <Input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <Button onClick={calculate}>
          <Calculator className="h-4 w-4" />
          Calculate
        </Button>
      </div>
      <div className="flex flex-col justify-center gap-4 border p-6">
        {result ? (
          <>
            <div>
              <p className="text-3xl font-bold text-primary">
                {result.shards.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">shards earned</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{result.spawners.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                spawners you can buy
                {result.left > 0 &&
                  ` (${result.left.toLocaleString()} shards left over)`}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter your numbers and hit calculate to see how many spawners your
            session funds.
          </p>
        )}
      </div>
    </div>
  )
}
