import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Boxes, Download, ThumbsUp, User } from 'lucide-react'

export interface Schematic {
  id: string
  title: string
  description: string | null
  category: string
  fileName: string
  fileUrl: string
  previewUrl: string | null
  author: string
  blocks: number
  sizeX: number
  sizeY: number
  sizeZ: number
  downloads: number
  upvotes: number
  createdAt: Date
}

export function SchematicCard({ schema }: { schema: Schematic }) {
  return (
    <Link href={`/schematics/${schema.id}`} className="group">
      <Card className="h-full overflow-hidden transition-colors group-hover:border-primary/50">
        <div className="relative aspect-video w-full overflow-hidden border-b bg-muted/40">
          {schema.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={schema.previewUrl}
              alt={schema.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No preview
            </div>
          )}
          <Badge className="absolute left-2 top-2 bg-background/80 uppercase tracking-wide backdrop-blur">
            {schema.category}
          </Badge>
          {schema.blocks > 0 && (
            <Badge className="absolute right-2 top-2 bg-background/80 backdrop-blur">
              <Boxes className="mr-1 h-3 w-3" />
              {schema.blocks.toLocaleString()}
            </Badge>
          )}
        </div>
        <CardContent className="space-y-2 p-4">
          <h3 className="font-semibold leading-snug group-hover:text-primary">
            {schema.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {schema.author}
              {schema.sizeX > 0 && (
                <span className="ml-1 opacity-70">
                  · {schema.sizeX}×{schema.sizeY}×{schema.sizeZ}
                </span>
              )}
            </span>
          </p>
          <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {schema.downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {schema.upvotes.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
