export type Rarity = 'comum' | 'rara' | 'lendaria' | 'secreta';
export type UserRole = 'usuario' | 'admin';

export interface Sticker {
  id: number;
  name: string;
  nickname: string;
  emoji: string;
  rarity: Rarity;
  chance: number;
  borderColor: string;
  description: string;
}

export interface AuthUser {
  login: string;
  role: UserRole;
  displayName: string;
}

export interface CollectedEntry {
  figurinha_id: number;
  data: string;
}

export interface AppData {
  [login: string]: CollectedEntry[];
}
