import type { LitematicModel } from './nbt'

const COLORS: Record<string, string> = {
  'minecraft:air': 'transparent',
  'minecraft:stone': '#7d7d7d',
  'minecraft:granite': '#9a6a5a',
  'minecraft:diorite': '#bfbfc0',
  'minecraft:andesite': '#8b8b8d',
  'minecraft:deepslate': '#4d4d51',
  'minecraft:cobblestone': '#7a7a7a',
  'minecraft:mossy_cobblestone': '#68785a',
  'minecraft:stone_bricks': '#7a7a7a',
  'minecraft:bricks': '#96604a',
  'minecraft:dirt': '#8a5f3c',
  'minecraft:grass_block': '#7fb238',
  'minecraft:coarse_dirt': '#7a5638',
  'minecraft:sand': '#dbd3a0',
  'minecraft:gravel': '#857f7e',
  'minecraft:sandstone': '#dcd3a2',
  'minecraft:netherrack': '#6e3534',
  'minecraft:nether_bricks': '#442027',
  'minecraft:soul_sand': '#513c31',
  'minecraft:blackstone': '#2a252b',
  'minecraft:basalt': '#4c4a52',
  'minecraft:obsidian': '#17102a',
  'minecraft:crying_obsidian': '#3d1c8c',
  'minecraft:quartz_block': '#ece5de',
  'minecraft:quartz_bricks': '#e6dcd3',
  'minecraft:glass': '#a8c8e8',
  'minecraft:sea_lantern': '#cde9e2',
  'minecraft:glowstone': '#f8d67c',
  'minecraft:shroomlight': '#eb9c5c',
  'minecraft:oak_planks': '#b8945f',
  'minecraft:spruce_planks': '#7a5a35',
  'minecraft:oak_log': '#6b5232',
  'minecraft:spruce_log': '#3b2a17',
  'minecraft:oak_leaves': '#4a7a2c',
  'minecraft:spruce_leaves': '#3d5e34',
  'minecraft:oak_slab': '#b8945f',
  'minecraft:oak_stairs': '#b8945f',
  'minecraft:oak_fence': '#b8945f',
  'minecraft:iron_block': '#d8d8d8',
  'minecraft:gold_block': '#f5d33c',
  'minecraft:diamond_block': '#5decd5',
  'minecraft:emerald_block': '#41c66d',
  'minecraft:lapis_block': '#2452b0',
  'minecraft:redstone_block': '#a81717',
  'minecraft:coal_block': '#0e0e0e',
  'minecraft:hopper': '#4c4c4c',
  'minecraft:chest': '#a06e33',
  'minecraft:trapped_chest': '#a06e33',
  'minecraft:barrel': '#876331',
  'minecraft:hay_block': '#b58a17',
  'minecraft:farmland': '#6b4a2e',
  'minecraft:dirt_path': '#98824c',
  'minecraft:water': '#2c4fc4',
  'minecraft:lava': '#d45a12',
  'minecraft:blue_ice': '#74a8f7',
  'minecraft:packed_ice': '#b3d7f5',
  'minecraft:snow_block': '#f0f6f6',
  'minecraft:slime_block': '#79c05a',
  'minecraft:honey_block': '#f7a72c',
  'minecraft:blue_concrete': '#2f6fd0',
  'minecraft:light_blue_concrete': '#7fb3e8',
  'minecraft:red_concrete': '#9c3532',
  'minecraft:white_concrete': '#cfd5d6',
  'minecraft:black_concrete': '#080a0f',
  'minecraft:gray_concrete': '#36393d',
  'minecraft:light_gray_concrete': '#9aa0a1',
  'minecraft:orange_concrete': '#e06a03',
  'minecraft:yellow_concrete': '#e6b70a',
  'minecraft:lime_concrete': '#77c61e',
  'minecraft:green_concrete': '#4c7218',
  'minecraft:cyan_concrete': '#157788',
  'minecraft:purple_concrete': '#71246e',
  'minecraft:magenta_concrete': '#a9309a',
  'minecraft:pink_concrete': '#d865a7',
  'minecraft:brown_concrete': '#5c4123',
  'minecraft:terracotta': '#985e43',
  'minecraft:white_terracotta': '#d5b191',
  'minecraft:smooth_stone': '#9f9f9f',
  'minecraft:polished_andesite': '#8c8c8e',
  'minecraft:polished_deepslate': '#48474b',
  'minecraft:polished_blackstone': '#37333b',
  'minecraft:iron_bars': '#8e8e8e',
  'minecraft:iron_door': '#b8b8b8',
  'minecraft:rail': '#9a8067',
  'minecraft:powered_rail': '#8a6a3b',
  'minecraft:redstone_lamp': '#8a5c34',
  'minecraft:dried_kelp_block': '#23301b',
  'minecraft:magma_block': '#8f4a1e',
  'minecraft:nether_wart_block': '#71090d',
  'minecraft:shroomlight_block': '#eb9c5c',
  'minecraft:campfire': '#8a5c34',
  'minecraft:bookshelf': '#9c7f4e',
  'minecraft:crafting_table': '#8a5c34',
  'minecraft:furnace': '#767676',
  'minecraft:smoker': '#686868',
  'minecraft:blast_furnace': '#6f6f6f',
  'minecraft:enchanting_table': '#7a3f3f',
  'minecraft:anvil': '#494949',
  'minecraft:beacon': '#63dcd2',
  'minecraft:spawner': '#2b2b3a',
  'minecraft:end_stone': '#dbdf9c',
  'minecraft:purpur_block': '#a97fa9',
  'minecraft:end_stone_bricks': '#dae0a6',
  'minecraft:shulker_box': '#976d6d',
  'minecraft:cobweb': '#e9e9e9',
  'minecraft:soul_torch': '#7fd1e8',
  'minecraft:torch': '#f9d379',
}

function hashColor(name: string): string {
  let h = 2166136261
  for (const c of name) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  const hue = (h >>> 0) % 360
  return `hsl(${hue} 35% 55%)`
}

function blockColor(name: string): string {
  if (COLORS[name]) return COLORS[name]
  const base = name.replace(/^minecraft:/, '')
  const known = Object.keys(COLORS).find((k) => base.startsWith(k.replace(/^minecraft:/, '')))
  if (known) return COLORS[known]
  return hashColor(name)
}

function isoWrap(polys: string[], minX: number, maxX: number, minY: number, maxY: number): string {
  const pad = 6
  const ox = -minX + pad
  const oy = -minY + pad
  const vw = Math.ceil(maxX - minX + pad * 2)
  const vh = Math.ceil(maxY - minY + pad * 2)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${vw}" height="${vh}"><g transform="translate(${ox} ${oy})">${polys.join('')}</g></svg>`
}

/**
 * Render one horizontal slice of the model (downsampled grid of palette
 * indices, -1 = air) as a flat isometric map.
 */
export function renderLayer(
  model: LitematicModel,
  y: number,
): string {
  const grid = model.layers[y]
  if (!grid) return isoWrap([], 0, 1, 0, 1)
  const { cellX: sx, cellZ: sz, palette } = model
  const TW = 14
  const TH = 7
  const polys: string[] = []
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

  for (let s = 0; s <= sx + sz - 2; s++) {
    for (let x = Math.max(0, s - sz + 1); x <= Math.min(s, sx - 1); x++) {
      const z = s - x
      const idx = grid[x * sz + z]
      if (idx < 0) continue
      const base = blockColor(palette[idx] ?? 'minecraft:stone')
      // subtle checker for depth perception
      const f = (x + z) % 2 === 0 ? 1 : 0.82
      let fill = base
      if (fill.startsWith('#')) {
        const n = parseInt(fill.slice(1), 16)
        const r = Math.min(255, Math.round(((n >> 16) & 255) * f))
        const g = Math.min(255, Math.round(((n >> 8) & 255) * f))
        const b = Math.min(255, Math.round((n & 255) * f))
        fill = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
      }
      const px = (x - z) * (TW / 2)
      const py = (x + z) * (TH / 2)
      minX = Math.min(minX, px - TW / 2); maxX = Math.max(maxX, px + TW / 2)
      minY = Math.min(minY, py); maxY = Math.max(maxY, py + TH)
      polys.push(
        `<polygon points="${px},${py} ${px + TW / 2},${py + TH / 2} ${px},${py + TH} ${px - TW / 2},${py + TH / 2}" fill="${fill}"/>`,
      )
    }
  }
  if (polys.length === 0) {
    polys.push(
      `<text x="0" y="0" font-size="10" fill="#888">empty layer</text>`,
    )
    minX = -60; maxX = 60; minY = -10; maxY = 10
  }
  return isoWrap(polys, minX, maxX, minY, maxY)
}

/**
 * Render an isometric top-down map of the model — one diamond per column,
 * colored by its topmost block and shaded by height. Sampled down to at
 * most `maxDim` cells per side.
 */
export function renderTopMap(model: LitematicModel, maxDim = 64): string {
  const { size, height, topBlock, palette } = model
  const stride = Math.max(1, Math.ceil(Math.max(size.x, size.z) / maxDim))
  const sx = Math.ceil(size.x / stride)
  const sz = Math.ceil(size.z / stride)

  // sample: keep the highest column in each cell
  const cellH = new Int16Array(sx * sz).fill(-1)
  const cellB = new Int32Array(sx * sz)
  for (let cx = 0; cx < sx; cx++) {
    for (let cz = 0; cz < sz; cz++) {
      for (let dx = 0; dx < stride; dx++) {
        for (let dz = 0; dz < stride; dz++) {
          const x = cx * stride + dx
          const z = cz * stride + dz
          if (x >= size.x || z >= size.z) continue
          const ci = x * size.z + z
          if (height[ci] > cellH[cx * sz + cz]) {
            cellH[cx * sz + cz] = height[ci]
            cellB[cx * sz + cz] = topBlock[ci]
          }
        }
      }
    }
  }

  const TW = 14
  const TH = 7
  const polys: string[] = []
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

  let maxHeight = 1
  for (let i = 0; i < cellH.length; i++) maxHeight = Math.max(maxHeight, cellH[i])

  for (let s = 0; s <= sx + sz - 2; s++) {
    for (let x = Math.max(0, s - sz + 1); x <= Math.min(s, sx - 1); x++) {
      const z = s - x
      const ci = x * sz + z
      if (cellH[ci] < 0) continue
      const base = blockColor(palette[cellB[ci]] ?? 'minecraft:stone')
      // height shading: 0.5 (deep) .. 1.05 (top)
      const t = cellH[ci] / maxHeight
      const f = 0.5 + t * 0.55
      let fill = base
      if (fill.startsWith('#')) {
        const n = parseInt(fill.slice(1), 16)
        const r = Math.min(255, Math.round(((n >> 16) & 255) * f))
        const g = Math.min(255, Math.round(((n >> 8) & 255) * f))
        const b = Math.min(255, Math.round((n & 255) * f))
        fill = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
      } else {
        // hsl(...) — adjust lightness by wrapping in a brightness filter
        fill = base
      }
      const px = (x - z) * (TW / 2)
      const py = (x + z) * (TH / 2)
      minX = Math.min(minX, px - TW / 2); maxX = Math.max(maxX, px + TW / 2)
      minY = Math.min(minY, py); maxY = Math.max(maxY, py + TH)
      polys.push(
        `<polygon points="${px},${py} ${px + TW / 2},${py + TH / 2} ${px},${py + TH} ${px - TW / 2},${py + TH / 2}" fill="${fill}"/>`,
      )
    }
  }

  const pad = 6
  const ox = -minX + pad
  const oy = -minY + pad
  const vw = Math.ceil(maxX - minX + pad * 2)
  const vh = Math.ceil(maxY - minY + pad * 2)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${vw}" height="${vh}"><g transform="translate(${ox} ${oy})">${polys.join('')}</g></svg>`
}
