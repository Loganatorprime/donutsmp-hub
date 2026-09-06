import { gunzipSync } from 'zlib'

/* ---------- complete NBT reader ---------- */

export class NBTReader {
  private b: Buffer
  off = 0

  constructor(data: Buffer) {
    this.b = data
  }

  private str(): string {
    const l = this.b.readUInt16BE(this.off)
    const s = this.b.toString('utf8', this.off + 2, this.off + 2 + l)
    this.off += 2 + l
    return s
  }

  payload(type: number): unknown {
    const b = this.b
    const o = () => this.off
    switch (type) {
      case 1: {
        const v = b.readInt8(o()); this.off += 1; return v
      }
      case 2: {
        const v = b.readInt16BE(o()); this.off += 2; return v
      }
      case 3: {
        const v = b.readInt32BE(o()); this.off += 4; return v
      }
      case 4: {
        const v = BigInt.asUintN(64, b.readBigInt64BE(o())); this.off += 8; return v
      }
      case 5: {
        const v = b.readFloatBE(o()); this.off += 4; return v
      }
      case 6: {
        const v = b.readDoubleBE(o()); this.off += 8; return v
      }
      case 7: {
        const l = b.readInt32BE(o()); this.off += 4
        const v = b.subarray(o(), o() + l); this.off += l; return v
      }
      case 8:
        return this.str()
      case 9: {
        const et = b.readInt8(o()); this.off += 1
        const n = b.readInt32BE(o()); this.off += 4
        const arr: unknown[] = []
        for (let i = 0; i < n; i++) arr.push(this.payload(et))
        return arr
      }
      case 10: {
        const out: Record<string, unknown> = {}
        for (;;) {
          const nt = b.readInt8(o()); this.off += 1
          if (nt === 0) break
          const name = this.str()
          out[name] = this.payload(nt)
        }
        return out
      }
      case 11: {
        const n = b.readInt32BE(o()); this.off += 4
        const v: number[] = []
        for (let i = 0; i < n; i++) { v.push(b.readInt32BE(o())); this.off += 4 }
        return v
      }
      case 12: {
        const n = b.readInt32BE(o()); this.off += 4
        const v: bigint[] = []
        for (let i = 0; i < n; i++) { v.push(BigInt.asUintN(64, b.readBigInt64BE(o()))); this.off += 8 }
        return v
      }
      default:
        throw new Error(`unknown NBT tag ${type} at ${this.off}`)
    }
  }

  readRoot(): { name: string; value: Record<string, unknown> } {
    const t = this.b.readInt8(this.off); this.off += 1
    if (t !== 10) throw new Error('root is not a compound')
    const name = this.str()
    return { name, value: this.payload(10) as Record<string, unknown> }
  }
}

/* ---------- litematic parsing ---------- */

export interface LitematicBlock {
  name: string
}

export interface LitematicModel {
  name: string
  author: string
  description: string
  size: { x: number; y: number; z: number }
  palette: string[] // block ids, index 0 usually air
  // per column (x*sizeZ + z): topmost non-air y (-1 = empty) and its palette index
  height: Int16Array
  topBlock: Int32Array
  // downsampled per-layer grids: layers[y][cx*cellZ + cz] = palette index or -1
  layers: Int16Array[]
  cellX: number
  cellZ: number
  stride: number
  totalBlocks: number
}

function unpackBits(longs: bigint[], bits: number, count: number): Int32Array {
  // litematica packs palette indices as a continuous bit-stream across the
  // long array (entries span long boundaries, LSB-first)
  const out = new Int32Array(count)
  const ONE = BigInt(1)
  for (let i = 0; i < count; i++) {
    let w = BigInt(0)
    for (let k = 0; k < bits; k++) {
      const abs = i * bits + k
      const lo = abs >> 6
      const bo = abs & 63
      if (lo < longs.length && ((longs[lo] >> BigInt(bo)) & ONE)) w |= ONE << BigInt(k)
    }
    out[i] = Number(w)
  }
  return out
}

export function parseLitematic(data: Buffer): LitematicModel {
  const gunzipped = data[0] === 0x1f && data[1] === 0x8b ? gunzipSync(data) : data
  const { value: root } = new NBTReader(gunzipped).readRoot()

  const regions = (root.Regions ?? {}) as Record<string, Record<string, unknown>>
  const regionNames = Object.keys(regions).filter(
    (k) => regions[k] && typeof regions[k] === 'object' && 'Size' in regions[k],
  )
  if (regionNames.length === 0) throw new Error('no regions found')
  const region = regions[regionNames[0]]

  const meta = (root.Metadata ?? {}) as Record<string, unknown>
  // region sizes can be negative (exporter quirk); use absolute dims
  const rawSize = region.Size as { x: number; y: number; z: number }
  const size = {
    x: Math.abs(rawSize.x),
    y: Math.abs(rawSize.y),
    z: Math.abs(rawSize.z),
  }
  const palette = (region.BlockStatePalette as { Name: string }[]).map(
    (p) => p.Name,
  )
  const longs = region.BlockStates as bigint[]

  const volume = size.x * size.y * size.z
  const bits = Math.max(2, 32 - Math.clz32(Math.max(1, palette.length - 1)))
  const blocks = unpackBits(longs, bits, volume)

  // index order in litematica: y * (x*z layers) + z * sizeX + x
  const height = new Int16Array(size.x * size.z).fill(-1)
  const topBlock = new Int32Array(size.x * size.z)
  // downsampled layer grids (max 48 cells per side)
  const stride = Math.max(1, Math.ceil(Math.max(size.x, size.z) / 48))
  const cellX = Math.ceil(size.x / stride)
  const cellZ = Math.ceil(size.z / stride)
  const layers: Int16Array[] = Array.from(
    { length: size.y },
    () => new Int16Array(cellX * cellZ).fill(-1),
  )
  let totalBlocks = 0
  for (let y = 0; y < size.y; y++) {
    const layer = layers[y]
    for (let z = 0; z < size.z; z++) {
      for (let x = 0; x < size.x; x++) {
        const idx = blocks[y * size.x * size.z + z * size.x + x]
        const id = palette[idx]
        if (!id || id === 'minecraft:air') continue
        totalBlocks++
        const ci = x * size.z + z
        if (y > height[ci]) {
          height[ci] = y
          topBlock[ci] = idx
        }
        const cell = Math.floor(x / stride) * cellZ + Math.floor(z / stride)
        if (layer[cell] === -1) layer[cell] = idx
      }
    }
  }

  return {
    name: String(meta.Name ?? regionNames[0] ?? 'Schematic'),
    author: String(meta.Author ?? 'Unknown'),
    description: String(meta.Description ?? ''),
    size,
    palette,
    height,
    topBlock,
    layers,
    cellX,
    cellZ,
    stride,
    totalBlocks,
  }
}
