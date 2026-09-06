import Link from 'next/link'
import { Donut } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Donut className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              DonutSMP Hub — community project, not affiliated with DonutSMP.
            </p>
          </div>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/prices" className="hover:text-foreground">
              Prices
            </Link>
            <Link href="/meta" className="hover:text-foreground">
              Farm Meta
            </Link>
            <Link href="/schematics" className="hover:text-foreground">
              Schematics
            </Link>
            <Link href="/trades" className="hover:text-foreground">
              Trades
            </Link>
            <Link href="/shops" className="hover:text-foreground">
              Shops
            </Link>
            <Link href="/showcase" className="hover:text-foreground">
              Showcase
            </Link>
            <Link href="/guides" className="hover:text-foreground">
              Guides
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
          NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH
          MOJANG OR MICROSOFT.
        </p>
      </div>
    </footer>
  )
}
