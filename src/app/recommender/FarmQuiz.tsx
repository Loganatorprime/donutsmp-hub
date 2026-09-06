'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { FARMS, type Farm } from '@/lib/farms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, RotateCcw } from 'lucide-react'

const CAPITAL = [
  { value: 'none', label: 'Broke — nothing but hands' },
  { value: 'low', label: 'Under 100K coins' },
  { value: 'mid', label: '100K – 1M coins' },
  { value: 'high', label: '1M+ burning a hole in my pocket' },
]

const TIME = [
  { value: 'afk', label: 'Mostly AFK while I sleep' },
  { value: 'casual', label: 'A few hours a day' },
  { value: 'hardcore', label: 'No-life mode, all day' },
]

const SKILL = [
  { value: 'easy', label: 'Simple builds only' },
  { value: 'medium', label: 'Comfortable with redstone' },
  { value: 'hard', label: 'Give me the jankiest tech' },
]

const ACCESS = [
  { value: 'overworld', label: 'Overworld only' },
  { value: 'nether', label: 'Nether access' },
  { value: 'end', label: 'Nether + End access' },
]

const GOAL = [
  { value: 'steady', label: 'Steady, reliable income' },
  { value: 'spike', label: 'Big money spikes, higher risk' },
]

const NETHER_FARMS = new Set(['fungus', 'gold', 'piglin-head', 'wither-skelly', 'mining'])
const END_FARMS = new Set(['shulker', 'enderman'])

const COST_RANK: Record<string, number> = { None: 0, Low: 1, Medium: 2, High: 3 }
const DIFF_RANK: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 }
const CAPITAL_RANK: Record<string, number> = { none: 0, low: 1, mid: 2, high: 3 }
const SKILL_RANK: Record<string, number> = { easy: 0, medium: 1, hard: 2 }
const ACCESS_RANK: Record<string, number> = { overworld: 0, nether: 1, end: 2 }

interface Answers {
  capital: string
  time: string
  skill: string
  access: string
  goal: string
}

function scoreFarm(farm: Farm, a: Answers): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  const costGap = COST_RANK[farm.upfrontCost] - CAPITAL_RANK[a.capital]
  if (costGap <= 0) {
    score += 2
    reasons.push('fits your budget')
  } else if (costGap === 1) {
    score += 1
  } else {
    score -= 2
    reasons.push('needs more capital than you have')
  }

  const skillGap = DIFF_RANK[farm.difficulty] - SKILL_RANK[a.skill]
  if (skillGap <= -1) {
    score += 2
    reasons.push('easy for your skill level')
  } else if (skillGap === 0) {
    score += 2
    reasons.push('matches your build skills')
  } else {
    score -= 2
    reasons.push('probably too technical for now')
  }

  if (a.time === 'afk') {
    if (farm.category === 'passive') {
      score += 2
      reasons.push('runs while you AFK')
    }
  } else if (a.time === 'hardcore' && (farm.category === 'combat' || farm.category === 'crafting')) {
    score += 1
    reasons.push('rewards active play')
  }

  const farmAccess = NETHER_FARMS.has(farm.id) ? 1 : END_FARMS.has(farm.id) ? 2 : 0
  if (farmAccess > ACCESS_RANK[a.access]) {
    score -= 3
    reasons.push(farmAccess === 2 ? 'requires End access' : 'requires Nether access')
  }

  if (a.goal === 'steady' && (farm.category === 'passive' || farm.category === 'trade')) {
    score += 1
    reasons.push('stable income')
  }
  if (a.goal === 'spike' && (farm.category === 'combat' || farm.id === 'ah-flip')) {
    score += 1
    reasons.push('high upside')
  }

  return { score, reasons }
}

function Question<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`border px-3 py-1.5 text-sm transition-colors ${
              value === o.value
                ? 'border-primary/60 bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function FarmQuiz() {
  const [answers, setAnswers] = useState<Answers>({
    capital: 'low',
    time: 'casual',
    skill: 'easy',
    access: 'overworld',
    goal: 'steady',
  })
  const [submitted, setSubmitted] = useState(false)

  const results = useMemo(() => {
    return FARMS.map((farm) => ({ farm, ...scoreFarm(farm, answers) }))
      .sort((x, y) => y.score - x.score || y.farm.coinsPerMinute - x.farm.coinsPerMinute)
      .slice(0, 3)
  }, [answers])

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <Question
          title="How much capital are you starting with?"
          options={CAPITAL}
          value={answers.capital}
          onChange={(v) => { setAnswers({ ...answers, capital: v }); setSubmitted(false) }}
        />
        <Question
          title="How do you play?"
          options={TIME}
          value={answers.time}
          onChange={(v) => { setAnswers({ ...answers, time: v }); setSubmitted(false) }}
        />
        <Question
          title="Redstone comfort level?"
          options={SKILL}
          value={answers.skill}
          onChange={(v) => { setAnswers({ ...answers, skill: v }); setSubmitted(false) }}
        />
        <Question
          title="What dimension can you build in?"
          options={ACCESS}
          value={answers.access}
          onChange={(v) => { setAnswers({ ...answers, access: v }); setSubmitted(false) }}
        />
        <Question
          title="What's the goal?"
          options={GOAL}
          value={answers.goal}
          onChange={(v) => { setAnswers({ ...answers, goal: v }); setSubmitted(false) }}
        />
      </div>

      {!submitted ? (
        <Button onClick={() => setSubmitted(true)}>
          Show my best farms
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your top 3 farms</h3>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              <RotateCcw className="h-3.5 w-3.5" />
              Retake
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {results.map(({ farm, reasons }, i) => (
              <Card key={farm.id} className={i === 0 ? 'border-primary/50' : ''}>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg">
                      #{i + 1}
                    </span>
                    <Badge variant="outline" className="text-muted-foreground">
                      {farm.estimate}
                    </Badge>
                  </div>
                  <h4 className="font-semibold leading-snug">{farm.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {farm.description}
                  </p>
                  <ul className="space-y-0.5 text-xs text-muted-foreground">
                    {reasons.slice(0, 3).map((r) => (
                      <li key={r}>· {r}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 pt-1 text-xs font-medium">
                    <Link href="/meta" className="text-primary hover:underline">
                      Full breakdown →
                    </Link>
                    {farm.schematicKeywords[0] && (
                      <Link
                        href={`/schematics?q=${encodeURIComponent(farm.schematicKeywords[0])}`}
                        className="text-primary hover:underline"
                      >
                        Get a schematic →
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
