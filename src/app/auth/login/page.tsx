import Link from 'next/link'
import { auth, signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoginForm } from './LoginForm'
import { NostrSignInButton } from '@/components/NostrSignInButton'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect('/')

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NostrSignInButton mode="signin" />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            demo login
            <span className="h-px flex-1 bg-border" />
          </div>
          <LoginForm />
          {process.env.DISCORD_CLIENT_ID && (
            <form
              action={async () => {
                'use server'
                await signIn('discord', { redirectTo: '/' })
              }}
            >
              <Button type="submit" variant="outline" className="w-full">
                Continue with Discord
              </Button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground">
            No account yet?{' '}
            <Link href="/auth/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Demo account: <code>demo@donutsmp.gg</code> / <code>donutsmp</code>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Accounts let you save schematics, track a portfolio, and favorite items.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
