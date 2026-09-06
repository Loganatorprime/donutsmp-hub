'use client'

import { useEffect, useRef } from 'react'
import {
  AreaSeries,
  createChart,
  type IChartApi,
  type UTCTimestamp,
} from 'lightweight-charts'

export interface ChartPoint {
  time: string
  price: number
}

export function PriceChart({ data }: { data: ChartPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: 'transparent' },
        textColor: 'hsl(60, 6%, 68%)',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'hsl(60, 6%, 68%, 0.1)' },
        horzLines: { color: 'hsl(60, 6%, 68%, 0.1)' },
      },
      rightPriceScale: { borderColor: 'hsl(60, 6%, 68%, 0.2)' },
      timeScale: { borderColor: 'hsl(60, 6%, 68%, 0.2)' },
      localization: {
        priceFormatter: (price: number) =>
          price >= 1_000_000
            ? `$${(price / 1_000_000).toFixed(2)}M`
            : price >= 1_000
              ? `$${(price / 1_000).toFixed(1)}K`
              : `$${price.toLocaleString()}`,
      },
    })
    chartRef.current = chart

    const series = chart.addSeries(AreaSeries, {
      lineColor: '#00a6ff',
      topColor: 'rgba(0, 166, 255, 0.25)',
      bottomColor: 'rgba(0, 166, 255, 0.02)',
      lineWidth: 2,
      priceLineVisible: false,
    })

    series.setData(
      data.map((d) => ({
        time: (new Date(d.time).getTime() / 1000) as UTCTimestamp,
        value: d.price,
      })),
    )

    chart.timeScale().fitContent()

    return () => {
      chart.remove()
      chartRef.current = null
    }
  }, [data])

  return <div ref={containerRef} className="h-72 w-full" />
}
