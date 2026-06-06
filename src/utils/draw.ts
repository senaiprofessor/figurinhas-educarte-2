import { stickers } from '../data/stickers';
import type { Sticker } from '../types';

export function drawSticker(): Sticker {
  const roll = Math.random() * 100;

  let rarity: Sticker['rarity'];
  if (roll < 60) rarity = 'comum';
  else if (roll < 85) rarity = 'rara';
  else if (roll < 95) rarity = 'lendaria';
  else rarity = 'secreta';

  const pool = stickers.filter((s) => s.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)]!;
}
