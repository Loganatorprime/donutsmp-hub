'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export interface ShopFormState {
  error: string | null
}

export async function createShop(
  _prev: ShopFormState,
  formData: FormData,
): Promise<ShopFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sign in to list a shop.' }

  const name = String(formData.get('name') ?? '').trim()
  const owner = String(formData.get('owner') ?? '').trim()
  const warp = String(formData.get('warp') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const tags = String(formData.get('tags') ?? '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5)
    .join(',')

  if (!name || !owner || !warp)
    return { error: 'Shop name, owner, and warp are required.' }

  await prisma.shop.create({
    data: {
      name,
      owner,
      warp,
      description: description || null,
      tags,
      createdBy: session.user.id,
    },
  })
  revalidatePath('/shops')
  return { error: null }
}

export async function upvoteShop(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (id) {
    await prisma.shop.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    })
  }
  revalidatePath('/shops')
}

export async function deleteShop(formData: FormData) {
  'use server'
  const session = await auth()
  const id = String(formData.get('id') ?? '')
  if (!session?.user?.id || !id) return
  await prisma.shop.deleteMany({ where: { id, createdBy: session.user.id } })
  revalidatePath('/shops')
}
