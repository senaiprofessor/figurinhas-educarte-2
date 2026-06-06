import { RARITY_CONFIG } from '../data/stickers';
import type { Rarity } from '../types';

interface BarChartProps {
  counts: Record<Rarity, number>;
  total: number;
}

export default function BarChart({ counts, total }: BarChartProps) {
  const rarities: Rarity[] = ['comum', 'rara', 'lendaria', 'secreta'];

  return (
    <div className="glass p-5 flex flex-col gap-4">
      <h3 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
        Distribuição por Raridade
      </h3>
      <div className="flex flex-col gap-3">
        {rarities.map((rarity) => {
          const cfg = RARITY_CONFIG[rarity];
          const count = counts[rarity];
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={rarity} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '0.8rem', color: cfg.color }}>
                  {cfg.label}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                  {count} ({pct.toFixed(1)}%)
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 9999,
                  overflow: 'hidden',
                }}
              >
                <div
                  className="bar-fill"
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}99)`,
                    borderRadius: 9999,
                    boxShadow: `0 0 8px ${cfg.color}88`,
                    minWidth: pct > 0 ? 4 : 0,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
