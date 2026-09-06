import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, Boxes, Download, ThumbsUp, User } from 'lucide-react'
import { prisma } from '@/lib/db'
import { LayerViewer } from '@/components/LayerViewer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: PageProps<'/schematics/[id]'>): Promise<Metadata> {
  const { id } = await params
  const s = await prisma.schematic.findUnique({ where: { id } })
  if (!s) return { title: 'Schematic not found' }
  return {
    title: `${s.title} schematic`,
    description: s.description ?? `Download the ${s.title} schematic.`,
  }
}

async function upvote(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.schematic.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    })
  }
}

export default async function SchematicDetailPage({
  params,
}: PageProps<'/schematics/[id]'>) {
  const { id } = await params
  const s = await prisma.schematic.findUnique({ where: { id } })

  if (!s) notFound()

  const format = s.fileName.endsWith('.litematic') ? 'Litematica' : 'WorldEdit'

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/schematics"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All schematics
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {s.previewUrl ? (
          <LayerViewer
            slug={s.fileName.replace(/\.litematic$/, '')}
            topMapUrl={s.previewUrl}
            sizeY={s.sizeY}
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center border bg-muted/40 text-muted-foreground">
            No preview
          </div>
        )}

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="uppercase tracking-wide">{s.category}</Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {format} · .{s.fileName.split('.').pop()}
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold">{s.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {s.author}
          </p>

          {s.description && (
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {s.description}
            </p>
          )}

          {s.blocks > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="border p-3 text-center">
                <Boxes className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-lg font-bold">
                  {s.blocks.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">blocks</p>
              </div>
              <div className="border p-3 text-center">
                <p className="mt-5 text-lg font-bold">
                  {s.sizeX}×{s.sizeY}×{s.sizeZ}
                </p>
                <p className="text-xs text-muted-foreground">footprint</p>
              </div>
              <div className="border p-3 text-center">
                <Download className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-lg font-bold">
                  {s.downloads.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">downloads</p>
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center gap-3 pt-6">
            {s.fileUrl ? (
              <a
                href={`/api/schematics/${s.id}/download`}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 border border-transparent bg-primary px-5 text-sm font-medium uppercase tracking-wide text-primary-foreground shadow-[inset_0_-3px_0_0_rgb(0_0_0/30%)] transition-colors hover:bg-primary/80"
              >
                <Download className="h-4 w-4" />
                Download {s.fileName}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">
                File coming soon
              </span>
            )}
            <form action={upvote}>
              <input type="hidden" name="id" value={s.id} />
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 border px-4 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ThumbsUp className="h-4 w-4" />
                {s.upvotes.toLocaleString()}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to paste it in-game</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>
                Install <span className="text-foreground">Litematica</span>{' '}
                (Fabric) — it loads .litematic files directly.
              </li>
              <li>
                Drop the file in{' '}
                <code className="rounded bg-muted px-1">
                  .minecraft/schematics
                </code>
                .
              </li>
              <li>
                In-game: open the Litematica menu (M), load the placement, and
                paste with WorldEdit or edit-mode.
              </li>
              <li>
                For .schem files use WorldEdit&apos;s{' '}
                <code className="rounded bg-muted px-1">{'//schem load'}</code>{' '}
                instead.
              </li>
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Before you build</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>Check current item prices on the Prices page first.</li>
              <li>
                Compare output against other methods on the{' '}
                <Link href="/meta" className="text-primary hover:underline">
                  Farm Meta
                </Link>{' '}
                page.
              </li>
              <li>
                Verify the build fits your claim — the footprint is listed
                above.
              </li>
              <li>
                Some farms need Nether or End access on DonutSMP.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
