import { useState } from 'react';
import type { CollectedEntry, Sticker } from '../types';
import { stickers } from '../data/stickers';
import StickerCard from './StickerCard';
import StickerModal from './StickerModal';

interface GalleryProps {
  collection: CollectedEntry[];
}

function resolveSticker(id: number): Sticker | undefined {
  return stickers.find((s) => s.id === id);
}

export default function Gallery({ collection }: GalleryProps) {
  const [selected, setSelected] = useState<{ sticker: Sticker; entry: CollectedEntry } | null>(null);

  if (collection.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 page-enter">
        <span style={{ fontSize: '4rem' }}>📭</span>
        <h3 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>
          Coleção vazia
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
          Abra pacotes para começar a colecionar figurinhas!
        </p>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: '#fff' }}>
          Minha Coleção
        </h2>
        <span
          className="glass px-3 py-1 text-sm"
          style={{ borderRadius: 9999, color: 'rgba(255,255,255,0.7)' }}
        >
          {collection.length} figurinha{collection.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '1rem',
        }}
      >
        {collection.map((entry, i) => {
          const sticker = resolveSticker(entry.figurinha_id);
          if (!sticker) return null;
          return (
            <StickerCard
              key={i}
              sticker={sticker}
              size="sm"
              onClick={() => setSelected({ sticker, entry })}
            />
          );
        })}
      </div>

      {selected && (
        <StickerModal
          sticker={selected.sticker}
          obtainedAt={selected.entry.data}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
