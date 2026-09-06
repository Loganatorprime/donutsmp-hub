'use server'

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export interface ShowcaseFormState {
  error: string | null
}

const MAX_IMAGE = 8 * 1024 * 1024
const ALLOWED_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

export async function createShowcase(
  _prev: ShowcaseFormState,
  formData: FormData,
): Promise<ShowcaseFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sign in to post a showcase.' }

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const owner = String(formData.get('owner') ?? '').trim()
  const imageUrlInput = String(formData.get('imageUrl') ?? '').trim()
  const file = formData.get('image') as File | null

  if (!title || !owner) return { error: 'Title and owner IGN are required.' }

  let imageUrl = ''
  if (file && file.size > 0) {
    if (file.size > MAX_IMAGE)
      return { error: 'Image is too large (max 8MB).' }
    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXT.includes(ext))
      return { error: 'Allowed types: png, jpg, webp, gif.' }
    const dir = path.join(process.cwd(), 'public', 'uploads', 'showcase')
    await mkdir(dir, { recursive: true })
    const name = `${crypto.randomUUID()}${ext}`
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))
    imageUrl = `/uploads/showcase/${name}`
  } else if (imageUrlInput) {
    if (!/^https?:\/\//.test(imageUrlInput))
      return { error: 'Image URL must start with http(s)://.' }
    imageUrl = imageUrlInput
  } else {
    return { error: 'Attach an image or paste an image URL.' }
  }

  await prisma.showcase.create({
    data: {
      title,
      description: description || null,
      imageUrl,
      owner,
      createdBy: session.user.id,
    },
  })
  revalidatePath('/showcase')
  return { error: null }
}

export async function upvoteShowcase(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.showcase.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    })
  }
  revalidatePath('/showcase')
}

export async function deleteShowcase(formData: FormData) {
  'use server'
  const session = await auth()
  const id = String(formData.get('id') ?? '')
  if (!session?.user?.id || !id) return
  await prisma.showcase.deleteMany({
    where: { id, createdBy: session.user.id },
  })
  revalidatePath('/showcase')
}
