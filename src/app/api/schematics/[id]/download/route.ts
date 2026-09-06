import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const schematic = await prisma.schematic.findUnique({ where: { id } })

  if (!schematic || !schematic.fileUrl) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.schematic.update({
    where: { id },
    data: { downloads: { increment: 1 } },
  })

  const url = new URL(schematic.fileUrl, request.url)
  return NextResponse.redirect(url, 302)
}
