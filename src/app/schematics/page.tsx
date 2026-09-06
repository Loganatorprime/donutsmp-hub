import Link from 'next/link'
import { Plus, Search, Download, ArrowUpDown } from 'lucide-react'
import { prisma } from '@/lib/db'
import { SchematicCard } from '@/components/SchematicCard'
import { Input } from '@/components/ui/input'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'farm', label: 'Farms' },
  { value: 'base', label: 'Bases' },
  { value: 'stash', label: 'Stashes' },
  { value: 'pvp', label: 'PvP' },
]

const SORTS = [
  { value: 'downloads', label: 'Most downloaded' },
  { value: 'upvotes', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'smallest', label: 'Smallest' },
]

export default async function SchematicsPage({
  searchParams,
}: PageProps<'/schematics'>) {
  const sp = await searchParams
  const category = typeof sp.category === 'string' ? sp.category : 'all'
  const sort = typeof sp.sort === 'string' ? sp.sort : 'downloads'
  const q = typeof sp.q === 'string' ? sp.q.trim() : ''

  const orderBy =
    sort === 'upvotes'
      ? { upvotes: 'desc' as const }
      : sort === 'newest'
        ? { createdAt: 'desc' as const }
        : sort === 'smallest'
          ? { blocks: 'asc' as const }
          : { downloads: 'desc' as const }

  const schematics = await prisma.schematic.findMany({
    where: {
      ...(category !== 'all' ? { category } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { author: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy,
    take: 100,
  })

  const qs = (patch: Record<string, string>) => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (sort !== 'downloads') params.set('sort', sort)
    if (q) params.set('q', q)
    for (const [k, v] of Object.entries(patch)) {
      if (v) params.set(k, v)
      else params.delete(k)
    }
    const s = params.toString()
    return s ? `/schematics?${s}` : '/schematics'
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-wide">Schematics</h1>
          <p className="mt-2 text-muted-foreground">
            Real community farm builds, stashes, and bases. All files are
            Litematica format — previews are rendered from the actual blocks.
          </p>
        </div>
        <Link
          href="/schematics/upload"
          className="inline-flex h-9 items-center gap-1.5 border border-transparent bg-primary px-4 text-sm font-medium uppercase tracking-wide text-primary-foreground shadow-[inset_0_-3px_0_0_rgb(0_0_0/30%)] transition-colors hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" />
          Upload
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={qs({ category: c.value === 'all' ? '' : c.value })}
              className={`border px-3 py-1.5 text-sm font-medium transition-colors ${
                category === c.value
                  ? 'border-primary/60 bg-primary/15 text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <form action="/schematics" method="GET" className="flex items-center">
            {category !== 'all' && (
              <input type="hidden" name="category" value={category} />
            )}
            {sort !== 'downloads' && <input type="hidden" name="sort" value={sort} />}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search farms, authors..."
                className="w-56 pl-8"
              />
            </div>
          </form>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ArrowUpDown className="h-4 w-4" />
            {SORTS.map((s) => (
              <Link
                key={s.value}
                href={qs({ sort: s.value === 'downloads' ? '' : s.value })}
                className={`px-2 py-1 transition-colors hover:text-foreground ${
                  sort === s.value ? 'font-medium text-primary' : ''
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {schematics.length === 0 ? (
        <p className="mt-8 border border-primary/30 bg-primary/10 p-4 text-sm">
          No schematics match. Try a different search or category.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {schematics.map((s) => (
            <SchematicCard key={s.id} schema={s} />
          ))}
        </div>
      )}

      <p className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Download className="h-3.5 w-3.5" />
        Credits and original sources are listed on each schematic&apos;s page.
      </p>
    </div>
  )
}
