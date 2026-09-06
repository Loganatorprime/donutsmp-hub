'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = ['farm', 'stash', 'base', 'pvp']

export function SchematicUploadForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('farm')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      setError('Please select a schematic file.')
      return
    }
    setLoading(true)
    setError('')

    const form = new FormData()
    form.append('title', title)
    form.append('description', description)
    form.append('category', category)
    form.append('file', file)
    if (preview) form.append('preview', preview)

    try {
      const res = await fetch('/api/schematics', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upload failed.')
      } else {
        router.push(`/schematics/${data.id}`)
        router.refresh()
      }
    } catch {
      setError('Upload failed. Did you include a storage token?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <Input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Benz V3 Kelp Farm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this build do? Estimated output?"
          rows={4}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <Select value={category} onValueChange={(v) => v && setCategory(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Schematic file (.litematic or .schem)
        </label>
        <Input
          required
          type="file"
          accept=".litematic,.schem,.schematic"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Preview image (optional)
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setPreview(e.target.files?.[0] ?? null)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </Button>
    </form>
  )
}
