import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const ALLOWED_CATEGORIES = ['farm', 'stash', 'base', 'pvp']
const MAX_SIZE = 50 * 1024 * 1024

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const form = await request.formData()
  const title = String(form.get('title') ?? '').trim()
  const description = String(form.get('description') ?? '').trim()
  const category = String(form.get('category') ?? 'farm')
  const file = form.get('file') as File | null
  const preview = form.get('preview') as File | null

  if (!title || !file) {
    return NextResponse.json({ error: 'Title and file are required' }, { status: 400 })
  }
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File is too large (max 50MB)' }, { status: 400 })
  }

  const fileBytes = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name)
  const fileName = file.name
  const author = session.user.name ?? 'Anonymous'

  try {
    let fileUrl: string

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`schematics/${crypto.randomUUID()}${ext}`, fileBytes, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
      })
      fileUrl = blob.url
    } else {
      const dir = path.join(process.cwd(), 'public', 'schematics')
      await mkdir(dir, { recursive: true })
      const id = crypto.randomUUID()
      await writeFile(path.join(dir, `${id}${ext}`), fileBytes)
      fileUrl = `/schematics/${id}${ext}`
    }

    let previewUrl: string | null = null
    if (preview && preview.type.startsWith('image/')) {
      const previewBytes = Buffer.from(await preview.arrayBuffer())
      const previewExt = path.extname(preview.name) || '.png'
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`schematics/previews/${crypto.randomUUID()}${previewExt}`, previewBytes, {
          access: 'public',
          contentType: preview.type,
        })
        previewUrl = blob.url
      } else {
        const dir = path.join(process.cwd(), 'public', 'schematics', 'previews')
        await mkdir(dir, { recursive: true })
        const id = crypto.randomUUID()
        await writeFile(path.join(dir, `${id}${previewExt}`), previewBytes)
        previewUrl = `/schematics/previews/${id}${previewExt}`
      }
    }

    const schematic = await prisma.schematic.create({
      data: {
        title,
        description,
        category,
        fileName,
        fileUrl,
        previewUrl,
        author,
        createdBy: session.user.id,
      },
    })

    return NextResponse.json({ id: schematic.id }, { status: 201 })
  } catch (err) {
    console.error('Schematic upload failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 },
    )
  }
}

export async function GET() {
  const schematics = await prisma.schematic.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json({ data: schematics })
}
