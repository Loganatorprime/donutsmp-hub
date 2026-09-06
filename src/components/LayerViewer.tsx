'use client'

import { useEffect, useState } from 'react'
import { Layers } from 'lucide-react'

interface LayerFile {
  y: number
  url: string
}

export function LayerViewer({
  slug,
  topMapUrl,
  sizeY,
}: {
  slug: string
  topMapUrl: string
  sizeY: number
}) {
  const [layers, setLayers] = useState<LayerFile[] | null>(null)
  const [idx, setIdx] = useState(-1) // -1 = overview (top map)

  useEffect(() => {
    fetch(`/schematics/previews/${slug}.json`)
      .then((r) => (r.ok ? r.json() : { layers: [] }))
      .then((d) => setLayers(d.layers ?? []))
      .catch(() => setLayers([]))
  }, [slug])

  const current =
    idx >= 0 && layers && layers[idx]
      ? { url: layers[idx].url, label: `Layer Y ${layers[idx].y} / ${sizeY - 1}` }
      : { url: topMapUrl, label: 'Overview (top-down)' }

  return (
    <div className="relative aspect-video w-full overflow-hidden border bg-muted/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.url}
        alt={current.label}
        className="h-full w-full object-cover [image-rendering:pixelated]"
      />
      {layers === null ? null : layers.length === 0 ? null : (
        <div className="absolute inset-x-3 bottom-3 rounded border bg-background/85 p-2.5 backdrop-blur">
          <div className="flex items-center gap-3">
            <Layers className="h-4 w-4 shrink-0 text-primary" />
            <input
              type="range"
              min={-1}
              max={layers.length - 1}
              value={idx}
              onChange={(e) => setIdx(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded bg-muted accent-[var(--primary)]"
              aria-label="Layer scrubber"
            />
            <span className="w-28 shrink-0 text-right text-xs text-muted-foreground">
              {current.label}
            </span>
          </div>
        </div>
      )}
      <span className="absolute right-2 top-2 border bg-background/85 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur">
        {current.label}
      </span>
    </div>
  )
}
