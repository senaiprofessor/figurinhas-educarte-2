import type { Sticker } from '../types';

export const stickers: Sticker[] = [
  // Comum (60%)
  {
    id: 1,
    name: 'Arthur Leitão',
    nickname: 'O Leitão',
    emoji: '🐷',
    rarity: 'comum',
    chance: 60,
    borderColor: '#60A5FA',
    description: 'A figurinha mais fácil de conseguir. Aparece em quase todo pacote que você abrir. Inconfundível.',
  },
  // Rara (25%)
  {
    id: 2,
    name: 'Emanuel Fuleco',
    nickname: 'O Tatu-Bola',
    emoji: '🦔',
    rarity: 'rara',
    chance: 25,
    borderColor: '#A855F7',
    description: 'Mascote lendário da Copa de 2014. Aparece de vez em quando nos pacotes, mas não é garantido.',
  },
  // Lendária (10%)
  {
    id: 3,
    name: 'Augusto Lesma',
    nickname: 'A Lesma',
    emoji: '🐌',
    rarity: 'lendaria',
    chance: 10,
    borderColor: '#F59E0B',
    description: 'Rara e misteriosa. Desliza pelos pacotes lentamente e quase nunca aparece. Considerada uma relíquia.',
  },
  // Secreta (5%)
  {
    id: 4,
    name: 'Haddad Protagonista',
    nickname: 'A Caveira Sigma',
    emoji: '💀',
    rarity: 'secreta',
    chance: 5,
    borderColor: '#DC2626',
    description: 'A mais rara de todas. Secreta, poderosa e temida. Pouquíssimos conseguiram desvendar o mistério da Caveira Sigma.',
  },
];

export const RARITY_CONFIG = {
  comum:    { label: 'Comum',    color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)',  threshold: 60 },
  rara:     { label: 'Rara',     color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)', threshold: 85 },
  lendaria: { label: 'Lendária', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', threshold: 95 },
  secreta:  { label: 'Secreta',  color: '#DC2626', bg: 'rgba(220, 38, 38, 0.15)',  threshold: 100 },
};
