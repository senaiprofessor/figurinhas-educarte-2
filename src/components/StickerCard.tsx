import type { Sticker } from '../types';
import { RARITY_CONFIG } from '../data/stickers';

interface StickerCardProps {
  sticker: Sticker;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StickerCard({ sticker, onClick, size = 'md' }: StickerCardProps) {
  const cfg = RARITY_CONFIG[sticker.rarity];

  const sizeStyles = {
    sm: { padding: '0.75rem', emojiSize: '2rem', nameSize: '0.75rem', nickSize: '0.65rem' },
    md: { padding: '1rem',    emojiSize: '2.5rem', nameSize: '0.875rem', nickSize: '0.75rem' },
    lg: { padding: '1.5rem',  emojiSize: '3.5rem', nameSize: '1rem',    nickSize: '0.875rem' },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`glass card-${sticker.rarity} flex flex-col items-center text-center gap-2 select-none`}
      style={{
        padding: sizeStyles.padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => { if (onClick) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.04)'; }}
      onMouseLeave={(e) => { if (onClick) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
    >
      <div style={{ fontSize: sizeStyles.emojiSize, lineHeight: 1 }}>{sticker.emoji}</div>
      <div>
        <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: sizeStyles.nameSize, color: '#fff', marginBottom: 2 }}>
          {sticker.name}
        </p>
        <p style={{ fontSize: sizeStyles.nickSize, color: 'rgba(255,255,255,0.6)' }}>
          {sticker.nickname}
        </p>
      </div>
      <span
        className="rarity-badge"
        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}
      >
        {cfg.label}
      </span>
    </div>
  );
}
