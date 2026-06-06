import { useEffect } from 'react';
import type { Sticker } from '../types';
import { RARITY_CONFIG } from '../data/stickers';

interface StickerModalProps {
  sticker: Sticker;
  obtainedAt: string;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function StickerModal({ sticker, obtainedAt, onClose }: StickerModalProps) {
  const cfg = RARITY_CONFIG[sticker.rarity];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass w-full max-w-sm mx-4"
        style={{ border: `2px solid ${cfg.color}`, boxShadow: `0 0 40px ${cfg.color}55` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-4 p-6">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <span
              className="rarity-badge"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}
            >
              {cfg.label}
            </span>
            <button
              onClick={onClose}
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', lineHeight: 1, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              ✕
            </button>
          </div>

          {/* Emoji */}
          <div style={{ fontSize: '4rem', lineHeight: 1 }}>{sticker.emoji}</div>

          {/* Name */}
          <div className="text-center">
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>
              {sticker.name}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>"{sticker.nickname}"</p>
          </div>

          {/* Description */}
          <p
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic' }}
          >
            {sticker.description}
          </p>

          {/* Timestamp */}
          <div
            className="w-full rounded-xl text-center"
            style={{ background: 'rgba(255,255,255,0.05)', padding: '0.625rem', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
              Obtida em
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
              {formatDate(obtainedAt)}
            </p>
          </div>

          {/* Seal */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>✦ Certificado Educarte ✦</span>
          </div>
        </div>
      </div>
    </div>
  );
}
