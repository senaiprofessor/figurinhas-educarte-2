import { stickers } from '../data/stickers';
import type { Sticker } from '../types';
import type { PackType } from '../types';

// normal: 60/25/10/5 | raro: 10/40/35/15
const THRESHOLDS: Record<PackType, { comum: number; rara: number; lendaria: number }> = {
  normal: { comum: 60, rara: 85, lendaria: 95 },
  raro:   { comum: 10, rara: 50, lendaria: 85 },
};

export function drawSticker(pack: PackType = 'normal'): Sticker {
  const roll = Math.random() * 100;
  const t = THRESHOLDS[pack];

  let rarity: Sticker['rarity'];
  if (roll < t.comum) rarity = 'comum';
  else if (roll < t.rara) rarity = 'rara';
  else if (roll < t.lendaria) rarity = 'lendaria';
  else rarity = 'secreta';

  const pool = stickers.filter((s) => s.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)]!;
}
