export type FarmCategory =
  | 'passive'
  | 'combat'
  | 'trade'
  | 'crafting'
  | 'mining'

export interface Farm {
  id: string
  name: string
  category: FarmCategory
  coinsPerMinute: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  upfrontCost: 'None' | 'Low' | 'Medium' | 'High'
  estimate: string
  itemSymbol?: string
  sellMethod: string
  description: string
  notes: string[]
  schematicKeywords: string[]
}

export const FARMS: Farm[] = [
  {
    id: 'pink-petals',
    name: 'Pink Petal Farm',
    category: 'passive',
    coinsPerMinute: 300000,
    difficulty: 'Medium',
    upfrontCost: 'High',
    estimate: '~300K coins/min',
    itemSymbol: 'PINK_PETALS',
    sellMethod: '/orders',
    description:
      'The highest-output farm on DonutSMP. Generates pink petals which feed strong buy orders.',
    notes: [
      'Requires significant upfront investment in the build.',
      'Returns are dramatic at scale.',
      'Best paired with a refinery/autocrafter to upsell petals.',
    ],
    schematicKeywords: ['pink-petal', 'petal'],
  },
  {
    id: 'kelp',
    name: 'Kelp Farm',
    category: 'passive',
    coinsPerMinute: 60000,
    difficulty: 'Easy',
    upfrontCost: 'Low',
    estimate: 'Steady, lower rate',
    itemSymbol: 'KELP',
    sellMethod: '/orders or /sell',
    description:
      'The best choice for consistent, predictable income. Simple to build and easy to repair.',
    notes: [
      'Dried kelp block demand is steady.',
      'Ideal while learning the market.',
      'Good stepping stone to pink petals.',
    ],
    schematicKeywords: ['kelp', 'kelp-farm'],
  },
  {
    id: 'fungus',
    name: 'Nether Fungus Farm',
    category: 'passive',
    coinsPerMinute: 240000,
    difficulty: 'Hard',
    upfrontCost: 'Medium',
    estimate: 'Very high volume',
    itemSymbol: 'CRIMSON_FUNGUS',
    sellMethod: '/orders (bulk)',
    description:
      'Produces enormous quantities of crimson/warped fungus and nether wart blocks.',
    notes: [
      'High volume, sells best in bulk through orders.',
      'Requires nether access and careful redstone.',
    ],
    schematicKeywords: ['fungus', 'nether-fungus', 'wart'],
  },
  {
    id: 'piglin-head',
    name: 'Piglin Head Farm',
    category: 'combat',
    coinsPerMinute: 2000000,
    difficulty: 'Hard',
    upfrontCost: 'High',
    estimate: '2M–4M per head',
    itemSymbol: 'PIGLIN_HEAD',
    sellMethod: '/ah or /orders',
    description:
      'Kills Piglins for their heads, which are stackable and highly valued.',
    notes: [
      'High unit value and demands premium on the AH.',
      'Requires a working piglin brute farm setup.',
    ],
    schematicKeywords: ['piglin', 'piglin-head'],
  },
  {
    id: 'spawner',
    name: 'Spawner Farm',
    category: 'passive',
    coinsPerMinute: 150000,
    difficulty: 'Easy',
    upfrontCost: 'High',
    estimate: 'Steady passive income',
    itemSymbol: 'SPAWNER',
    sellMethod: '/ah',
    description:
      'Spawners are purchased with shards and passively generate mob loot around the clock.',
    notes: [
      'Per-spawner output falls as farms grow.',
      'Use the spawner calculator before expanding.',
      'Shards are earned via AFK zone (1/min) or player kills (10).',
    ],
    schematicKeywords: ['spawner', 'mob', 'grinder'],
  },
  {
    id: 'villager',
    name: 'Villager Trading',
    category: 'trade',
    coinsPerMinute: 80000,
    difficulty: 'Easy',
    upfrontCost: 'Low',
    estimate: 'Stable, variable',
    sellMethod: 'Direct trade',
    description:
      'Fast, stable income from villager trades. Farm max-level enchanted books and trade them.',
    notes: [
      'Zombify and cure villagers to cut prices.',
      'Rebalancing can increase the effort for top books.',
      'Good for new players with no capital.',
    ],
    schematicKeywords: ['villager', 'trading-hall'],
  },
  {
    id: 'cobblestone',
    name: 'Cobblestone / Auto-Crafter',
    category: 'crafting',
    coinsPerMinute: 1300000,
    difficulty: 'Medium',
    upfrontCost: 'Medium',
    estimate: 'Up to $80M/hr claimed',
    itemSymbol: 'COBBLESTONE',
    sellMethod: '/orders or /ah',
    description:
      'The newer meta — generate cobblestone and feed it into auto-crafters to upscale into higher-value items.',
    notes: [
      'Very volume dependent; check buy orders before building.',
      'Recent update meta; verify current item margins.',
    ],
    schematicKeywords: ['cobble', 'cobblestone', 'auto-crafter', 'smoker'],
  },
  {
    id: 'mining',
    name: 'Mining (Netherite)',
    category: 'mining',
    coinsPerMinute: 50000,
    difficulty: 'Medium',
    upfrontCost: 'None',
    estimate: 'Variable by luck',
    itemSymbol: 'ANCIENT_DEBRIS',
    sellMethod: '/ah',
    description:
      'Mine ancient debris in the nether to craft netherite ingots, which are always in demand.',
    notes: [
      'Netherite ingots are a stable long-term hold.',
      'Direct mineral mining is a reliable solo earner.',
    ],
    schematicKeywords: ['mining', 'tunnel'],
  },
  {
    id: 'gold',
    name: 'Gold Farm + Bartering',
    category: 'passive',
    coinsPerMinute: 220000,
    difficulty: 'Hard',
    upfrontCost: 'High',
    estimate: 'Very high throughput',
    itemSymbol: 'GOLD_INGOT',
    sellMethod: '/orders or barter',
    description:
      'Nether gold farm feeding piglin bartering — gold ingots flow constantly and sell in bulk.',
    notes: [
      'Barter excess gold for obsidian, gravel, and soul sand to resell.',
      'Zombified piglin aggro radius matters at scale.',
      'Pair with an auto-smelter to keep up with raw gold.',
    ],
    schematicKeywords: ['gold', 'bartering', 'piglin'],
  },
  {
    id: 'iron',
    name: 'Iron Farm',
    category: 'passive',
    coinsPerMinute: 110000,
    difficulty: 'Medium',
    upfrontCost: 'Medium',
    estimate: 'Steady iron income',
    itemSymbol: 'IRON_INGOT',
    sellMethod: '/orders',
    description:
      'Villager-based iron golem farm. Iron is always in demand for hoppers, anvils, and armor.',
    notes: [
      'Consistent seller — check /orders before dumping stock.',
      'Needs a nearby villager breeder to keep panic rates high.',
      'Iron golem caps scale with villager count, not spawn space.',
    ],
    schematicKeywords: ['iron', 'golem', 'villager'],
  },
  {
    id: 'raid',
    name: 'Raid Farm',
    category: 'combat',
    coinsPerMinute: 300000,
    difficulty: 'Hard',
    upfrontCost: 'Medium',
    estimate: 'Totems + emeralds',
    itemSymbol: 'TOTEM_OF_UNDYING',
    sellMethod: '/ah',
    description:
      'Force and farm pillager raids for totems of undying and stacks of emeralds.',
    notes: [
      'Bad omen cycling needs careful villager placement.',
      'Emeralds flood fast — sell totems on the AH for the real margin.',
      'Great combo with a villager trading hall.',
    ],
    schematicKeywords: ['raid', 'pillager', 'totem'],
  },
  {
    id: 'sugarcane',
    name: 'Sugar Cane Farm',
    category: 'passive',
    coinsPerMinute: 45000,
    difficulty: 'Easy',
    upfrontCost: 'Low',
    estimate: 'Cheap starter income',
    itemSymbol: 'SUGAR_CANE',
    sellMethod: '/orders or /sell',
    description:
      'Classic zero-tick-free observer farm. Cheap, expandable, and perfect first farm.',
    notes: [
      'Scales linearly — just add modules.',
      'Paper demand stays healthy from rocket crafters.',
      'Great early-game choice before kelp money kicks in.',
    ],
    schematicKeywords: ['sugarcane', 'sugar-cane', 'cane'],
  },
  {
    id: 'melon',
    name: 'Melon & Pumpkin Farm',
    category: 'passive',
    coinsPerMinute: 70000,
    difficulty: 'Easy',
    upfrontCost: 'Low',
    estimate: 'Solid mid-tier income',
    itemSymbol: 'MELON_SLICE',
    sellMethod: '/orders',
    description:
      'Simple piston-harvest farm producing melons and pumpkins for steady coin.',
    notes: [
      'Pumpkins carve extra value with shears modules.',
      'Cheap to expand; good pair with a composter loop.',
    ],
    schematicKeywords: ['melon', 'pumpkin'],
  },
  {
    id: 'shulker',
    name: 'Shulker Farm',
    category: 'combat',
    coinsPerMinute: 260000,
    difficulty: 'Hard',
    upfrontCost: 'High',
    estimate: 'High-value shells',
    itemSymbol: 'SHULKER_SHELL',
    sellMethod: '/ah',
    description:
      'End-gate shulker duplication farm. Shells and shulker boxes sell for premium prices.',
    notes: [
      'Shulker boxes are top-tier AH sellers.',
      'Requires end access and careful chunk-loading.',
      'Duct design determines duplication rate.',
    ],
    schematicKeywords: ['shulker', 'end'],
  },
  {
    id: 'wither-skelly',
    name: 'Wither Skeleton Farm',
    category: 'combat',
    coinsPerMinute: 180000,
    difficulty: 'Hard',
    upfrontCost: 'Medium',
    estimate: 'Wither skulls + coal',
    itemSymbol: 'WITHER_SKELETON_SKULL',
    sellMethod: '/ah',
    description:
      'Fortress-spanning wither skeleton farm. Skulls fund beacons and sell high on the AH.',
    notes: [
      'Coal byproduct feeds smoker setups.',
      'Needs fortress cleansing and wither-safe walls.',
      'Beacons crafted from skulls sell at a premium.',
    ],
    schematicKeywords: ['wither', 'fortress', 'skeleton'],
  },
  {
    id: 'enderman',
    name: 'Enderman Farm',
    category: 'combat',
    coinsPerMinute: 140000,
    difficulty: 'Medium',
    upfrontCost: 'Medium',
    estimate: 'Pearls + XP',
    itemSymbol: 'ENDER_PEARL',
    sellMethod: '/orders',
    description:
      'End-based enderman grinder — pearls sell steadily and the XP fuels enchanting.',
    notes: [
      'Endermite bait designs are cheapest to build.',
      'XP byproduct pays for mending books.',
      'Pearls move fast in bulk via /orders.',
    ],
    schematicKeywords: ['enderman', 'pearl', 'end'],
  },
  {
    id: 'slime',
    name: 'Slime Farm',
    category: 'passive',
    coinsPerMinute: 55000,
    difficulty: 'Medium',
    upfrontCost: 'Low',
    estimate: 'Steady slimeballs',
    itemSymbol: 'SLIME_BALL',
    sellMethod: '/orders',
    description:
      'Slimechunk farm producing slimeballs for sticks, leads, and sticky pistons.',
    notes: [
      'Sticky pistons are needed by every big farm build.',
      'Locate slime chunks before committing to a site.',
    ],
    schematicKeywords: ['slime'],
  },
  {
    id: 'shop-flip',
    name: '/shop Flipping',
    category: 'trade',
    coinsPerMinute: 90000,
    difficulty: 'Easy',
    upfrontCost: 'Low',
    estimate: 'Margin-dependent',
    sellMethod: '/shop resale',
    description:
      'Buy underpriced goods from the server shop and resell during demand spikes.',
    notes: [
      'Track price history on this site to spot dips.',
      'Margins shrink as more players catch on.',
      'No build cost — pure market play.',
    ],
    schematicKeywords: [],
  },
  {
    id: 'ah-flip',
    name: 'AH Sniping',
    category: 'trade',
    coinsPerMinute: 250000,
    difficulty: 'Medium',
    upfrontCost: 'Medium',
    estimate: 'High variance',
    sellMethod: '/ah resale',
    description:
      'Snipe mispriced auctions and relist at market rate. Highest coins-per-minute of any method when it hits.',
    notes: [
      'Refresh /ah frequently — deals go in seconds.',
      'Know your item values cold; use the price tables here.',
      'Spawners and netherite are the classic snipe targets.',
    ],
    schematicKeywords: [],
  },
]

export function getFarm(id: string): Farm | undefined {
  return FARMS.find((f) => f.id === id)
}

export function bestFarm(): Farm {
  return [...FARMS].sort((a, b) => b.coinsPerMinute - a.coinsPerMinute)[0]
}
