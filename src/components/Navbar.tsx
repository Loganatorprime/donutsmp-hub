import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getServerStatus } from '@/lib/server-status'
import {
  Donut,
  TrendingUp,
  Sprout,
  Boxes,
  Wallet,
  BookOpen,
  ArrowLeftRight,
  Store,
  Camera,
  LogOut,
  LogIn,
} from 'lucide-react'

export default async function Navbar() {
  const [session, status] = await Promise.all([auth(), getServerStatus()])

  const links = [
    { href: '/prices', label: 'Prices', icon: TrendingUp },
    { href: '/movers', label: 'Movers', icon: TrendingUp },
    { href: '/meta', label: 'Meta', icon: Sprout },
    { href: '/schematics', label: 'Schematics', icon: Boxes },
    { href: '/trades', label: 'Trades', icon: ArrowLeftRight },
    { href: '/shops', label: 'Shops', icon: Store },
    { href: '/showcase', label: 'Showcase', icon: Camera },
    { href: '/guides', label: 'Guides', icon: BookOpen },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <Donut className="h-6 w-6 text-primary transition-transform group-hover:rotate-45" />
            <span className="font-heading text-lg tracking-wide">
              Donut<span className="text-primary">SMP</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span
              className="hidden items-center gap-1.5 border px-2.5 py-1 text-xs text-muted-foreground sm:inline-flex"
              title={status.version ? `DonutSMP.net (${status.version})` : 'DonutSMP.net'}
            >
              <span
                className={`h-2 w-2 ${
                  status.online ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                aria-hidden
              />
              {status.online && status.players
                ? `${status.players.online.toLocaleString()}/${status.players.max.toLocaleString()} online`
                : 'Offline'}
            </span>
          )}
          {session?.user ? (
            <>
              <Link
                href="/portfolio"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Wallet className="h-4 w-4" />
                Portfolio
              </Link>
              <Link
                href="/api/auth/signout"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
