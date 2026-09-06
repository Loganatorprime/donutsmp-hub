import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { prisma } from '../lib/db'
import { parseLitematic } from './nbt'
import { renderTopMap, renderLayer } from './preview'
import { readFileSync } from 'fs'

const FILES_DIR = path.join(process.cwd(), 'public', 'schematics', 'files')
const PREVIEWS_DIR = path.join(process.cwd(), 'public', 'schematics', 'previews')

interface SeedSchematic {
  title: string
  file: string
  category: string
  author: string
  source: string
  description: string
}

const SCHEMATICS: SeedSchematic[] = [
  // --- DonutSMP community classics (mirrored from donutsmp-schematics.com) ---
  {
    title: 'Benz V3 Kelp Farm',
    file: 'benz-v3-kelp-farm.litematic',
    category: 'farm',
    author: 'benzisthebest',
    source: 'donutsmp-schematics.com',
    description:
      'The famous DonutSMP kelp farm — one of the most-used passive income builds on the server. Feeds dried kelp into smokers or bulk /orders.',
  },
  {
    title: 'Fire Azure V3 — 1483 Smokers',
    file: 'fire-azure-v3-1483-smokers.litematic',
    category: 'farm',
    author: 'Fire Azure',
    source: 'donutsmp-schematics.com',
    description:
      'Massive smoker array for the kelp-to-dried-kelp chain. The centerpiece of many top DonutSMP money printers.',
  },
  {
    title: 'Lox V11 Kelp Farm',
    file: 'lox-v11-kelp-farm.litematic',
    category: 'farm',
    author: 'Lox',
    source: 'donutsmp-schematics.com',
    description:
      'Latest revision of the Lox kelp farm series — high-throughput, expandable modules tuned for DonutSMP rates.',
  },
  {
    title: 'Supermati Kelp V1',
    file: 'supermati-kelp-v1.litematic',
    category: 'farm',
    author: 'Supermati',
    source: 'donutsmp-schematics.com',
    description:
      'Compact kelp farm alternative to the Benz designs. Great fit for smaller claims.',
  },
  {
    title: 'DonutSMP Slime Farm',
    file: 'slime-farm.litematic',
    category: 'farm',
    author: 'DonutSMP community',
    source: 'donutsmp-schematics.com',
    description:
      'Slimechunk ball farm producing slimeballs for sticky pistons, leads, and mango... every big build needs these.',
  },
  {
    title: 'Ghost-Resistant Slime Farm + Storage',
    file: 'ghost-resistant-slime-storage.litematic',
    category: 'farm',
    author: 'DonutSMP community',
    source: 'donutsmp-schematics.com',
    description:
      'Slime farm with integrated storage that resists ghost blocks — a common issue on high-latency servers.',
  },
  {
    title: 'DonutSMP Enderman Farm',
    file: 'enderman-farm.litematic',
    category: 'farm',
    author: 'DonutSMP community',
    source: 'donutsmp-schematics.com',
    description:
      'Enderman grinder for pearls and XP. Pearls move fast in bulk on /orders, and the XP pays for mending books.',
  },
  {
    title: 'Shulker Crafter V1',
    file: 'shulker-crafter-v1.litematic',
    category: 'base',
    author: 'DonutSMP community',
    source: 'donutsmp-schematics.com',
    description:
      'Automated shulker box crafting station — turns farmed shells into boxes worth serious coin on the AH.',
  },

  // --- Community farms (GitHub: Bavouille) ---
  {
    title: 'Giant Iron Farm',
    file: 'giant-iron-farm.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Large multi-cell iron farm. Iron is forever in demand for hoppers and gear — steady, boring, profitable.',
  },
  {
    title: 'No-Water Iron Farm',
    file: 'no-water-iron-farm.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Waterless iron golem farm — ideal for nether or frozen claims where water is a problem.',
  },
  {
    title: 'Gold Farm',
    file: 'gold-farm.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Nether gold farm — raw gold feeds bartering or sells in bulk. Pairs with the bartering farm below.',
  },
  {
    title: 'Bartering Farm',
    file: 'bartering-farm.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Piglin bartering station — feed it gold, get obsidian, gravel, soul sand, and the odd crying obsidian.',
  },
  {
    title: 'Raid Farm (compact)',
    file: 'raid-farm-compact.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Compact bad-omen raid cycler. Totems on the AH, emeralds to your villager trades.',
  },
  {
    title: 'Spawner Farm Module',
    file: 'spawner-farm-module.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Tileable grinder module for spawner farms on DonutSMP — stack modules as you buy spawners with shards.',
  },
  {
    title: 'Wither Skeleton Farm',
    file: 'wither-skeleton-farm.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Wither skull farm — skulls craft into beacons, and beacons sell. Coal byproduct feeds your smokers.',
  },
  {
    title: 'Bamboo Farm',
    file: 'bamboo-farm.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Bamboo generator — free fuel for the smoker arrays that power the kelp meta.',
  },
  {
    title: 'Witch Farm',
    file: 'witch-farm.litematic',
    category: 'farm',
    author: 'Bavouille',
    source: 'github.com/BavouilleDev/schematics',
    description:
      'Witch hut grinder for redstone, glowstone, gunpowder, and sticks — surprisingly strong on an economy server.',
  },

  // --- Community farms (GitHub: sargon2, cornernote, eternum) ---
  {
    title: 'Sugar Cane Farm',
    file: 'sugar-cane-farm.litematic',
    category: 'farm',
    author: 'sargon2',
    source: 'github.com/sargon2/minecraft_schematics',
    description:
      'Classic observer sugar cane farm. Cheap starter income and paper for rockets.',
  },
  {
    title: 'Slime Farm (manual)',
    file: 'slime-farm-manual.litematic',
    category: 'farm',
    author: 'sargon2',
    source: 'github.com/sargon2/minecraft_schematics',
    description:
      'Manual-harvest slimechunk farm — simple, no redstone degree required.',
  },
  {
    title: 'Ocean Mob Farm (potato_noir)',
    file: 'ocean-mob-farm.litematic',
    category: 'farm',
    author: 'sargon2 / potato_noir',
    source: 'github.com/sargon2/minecraft_schematics',
    description:
      'Small ocean general mob farm — rotten flesh, bones, string, and gunpowder around the clock.',
  },
  {
    title: 'Cobblestone Generator (ilmango mini)',
    file: 'cobblestone-generator-ilmango.litematic',
    category: 'farm',
    author: 'ilmango / sargon2',
    source: 'github.com/sargon2/minecraft_schematics',
    description:
      'Mini cobblestone generator by ilmango — the front half of the DonutSMP auto-crafter cobble meta.',
  },
  {
    title: 'Cactus Farm',
    file: 'cactus-farm.litematic',
    category: 'farm',
    author: 'sargon2',
    source: 'github.com/sargon2/minecraft_schematics',
    description:
      'Simple tileable cactus farm. Low effort, always sells.',
  },
  {
    title: 'Gold XP Farm',
    file: 'gold-xp-farm.litematic',
    category: 'farm',
    author: 'sargon2',
    source: 'github.com/sargon2/minecraft_schematics',
    description:
      'Gold farm with an XP collection path — level up while your gold stacks up.',
  },
  {
    title: 'Raid Farm',
    file: 'raid-farm.litematic',
    category: 'farm',
    author: 'PuffingFishHQ / cornernote',
    source: 'github.com/cornernote/minecraft-schematics',
    description:
      'Full-size pillager raid farm (154 blocks tall) — totems, emeralds, and crossbows by the stack.',
  },
  {
    title: 'Melon Farm Module',
    file: 'melon-farm-module.litematic',
    category: 'farm',
    author: 'cornernote',
    source: 'github.com/cornernote/minecraft-schematics',
    description:
      'Tileable melon module — stamp out as many as you need.',
  },
  {
    title: 'Pumpkin Farm Module',
    file: 'pumpkin-farm-module.litematic',
    category: 'farm',
    author: 'cornernote',
    source: 'github.com/cornernote/minecraft-schematics',
    description:
      'Tileable pumpkin module — pair with the melon module for mixed produce income.',
  },
  {
    title: 'Iron Golem Villager Farm',
    file: 'iron-golem-villager-farm.litematic',
    category: 'farm',
    author: 'cornernote',
    source: 'github.com/cornernote/minecraft-schematics',
    description:
      'Villager-driven iron farm — iron plus villager trade profits in one footprint.',
  },
  {
    title: 'Villager Trading Hall',
    file: 'villager-trading-hall.litematic',
    category: 'base',
    author: 'Eternum',
    source: 'github.com/eternum/schematics',
    description:
      'Compact trading hall for discounted enchanted books — the classic stable-income build.',
  },
  {
    title: 'Trading Hall',
    file: 'trading-hall.litematic',
    category: 'base',
    author: 'sargon2',
    source: 'github.com/sargon2/minecraft_schematics',
    description:
      'Larger trading hall layout with workstation wall and storage drop-off.',
  },
  {
    title: 'Super Smelter',
    file: 'super-smelter.litematic',
    category: 'base',
    author: 'Eternum',
    source: 'github.com/eternum/schematics',
    description:
      'High-throughput furnace array — smelt entire kelp harvests in minutes, not hours.',
  },
  {
    title: 'Multicrop Farm',
    file: 'multicrop-farm.litematic',
    category: 'farm',
    author: 'Eternum',
    source: 'github.com/eternum/schematics',
    description:
      'Wheat, carrot, potato, and beetroot in one build — feed villagers and players alike.',
  },

  // --- Stashes (archive.org mcarchive) ---
  {
    title: 'Massive Stash (~4k double chests)',
    file: 'massive-stash.litematic',
    category: 'stash',
    author: 'mcarchive',
    source: 'archive.org/details/mcarchive',
    description:
      'Legendary ~4,000 double-chest storage hall from the anarchy community. For when your kemp empire outgrows the vault.',
  },
  {
    title: 'The Real Stash 8b',
    file: 'the-real-stash-8b.litematic',
    category: 'stash',
    author: 'mcarchive',
    source: 'archive.org/details/mcarchive',
    description:
      'Classic 8b-style stash design — compact, defensible, and easy to hide deep underground.',
  },
]

async function main() {
  console.log('Seeding real community schematics...')

  await mkdir(PREVIEWS_DIR, { recursive: true })

  // wipe previously seeded rows (user uploads are kept)
  const deleted = await prisma.schematic.deleteMany({ where: { createdBy: null } })
  console.log(`  - removed ${deleted.count} old seeded rows`)

  for (const s of SCHEMATICS) {
    const slug = s.file.replace(/\.litematic$/, '')
    const filePath = path.join(FILES_DIR, s.file)
    const model = parseLitematic(readFileSync(filePath))

    const svg = renderTopMap(model)
    await writeFile(path.join(PREVIEWS_DIR, `${slug}.svg`), svg)

    // per-layer maps + manifest for the layer viewer (max 40 layers)
    const MAX_LAYER_IMAGES = 40
    const layerStride = Math.max(1, Math.ceil(model.size.y / MAX_LAYER_IMAGES))
    const layerFiles: { y: number; url: string }[] = []
    for (let y = 0; y < model.size.y; y += layerStride) {
      const file = `${slug}-L${y}.svg`
      await writeFile(path.join(PREVIEWS_DIR, file), renderLayer(model, y))
      layerFiles.push({ y, url: `/schematics/previews/${file}` })
    }
    await writeFile(
      path.join(PREVIEWS_DIR, `${slug}.json`),
      JSON.stringify({ layers: layerFiles }),
    )

    await prisma.schematic.upsert({
      where: { id: 'seed-' + slug },
      update: {
        title: s.title,
        description: s.description,
        category: s.category,
        author: s.author,
        fileName: s.file,
        fileUrl: `/schematics/files/${s.file}`,
        previewUrl: `/schematics/previews/${slug}.svg`,
        blocks: model.totalBlocks,
        sizeX: model.size.x,
        sizeY: model.size.y,
        sizeZ: model.size.z,
      },
      create: {
        id: 'seed-' + slug,
        title: s.title,
        description: `${s.description} (Credit: ${s.author} via ${s.source})`,
        category: s.category,
        author: s.author,
        fileName: s.file,
        fileUrl: `/schematics/files/${s.file}`,
        previewUrl: `/schematics/previews/${slug}.svg`,
        blocks: model.totalBlocks,
        sizeX: model.size.x,
        sizeY: model.size.y,
        sizeZ: model.size.z,
        downloads: 40 + ((slug.length * 37) % 900),
        upvotes: 5 + ((slug.length * 13) % 120),
      },
    })
    console.log(
      `  + ${s.title} — ${model.totalBlocks} blocks, ${model.size.x}x${model.size.y}x${model.size.z}`,
    )
  }

  console.log('Done.')
}

main().finally(() => prisma.$disconnect())
