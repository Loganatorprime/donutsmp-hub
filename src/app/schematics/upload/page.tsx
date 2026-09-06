import { SchematicUploadForm } from '@/components/SchematicUploadForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function UploadPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Upload Schematic</h1>
      <p className="mt-2 text-muted-foreground">
        Share a farm, stash, base, or PvP build with the DonutSMP community.
        Upload a .litematic or .schem file.
      </p>
      <div className="mt-8">
        <SchematicUploadForm />
      </div>
    </div>
  )
}
