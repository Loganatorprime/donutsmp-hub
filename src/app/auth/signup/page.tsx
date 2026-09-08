import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SignupForm } from './SignupForm'
import { NostrSignInButton } from '@/components/NostrSignInButton'

export default async function SignupPage() {
  const session = await auth()
  if (session?.user) redirect('/')

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NostrSignInButton mode="signup" />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or sign up with email
            <span className="h-px flex-1 bg-border" />
          </div>
          <SignupForm />
          <p className="text-center text-sm text-muted-foreground">
            Your account is your Nostr identity — no email or password needed.
            First sign-in creates the account.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Accounts let you save schematics, track a portfolio, and favorite
            items.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
