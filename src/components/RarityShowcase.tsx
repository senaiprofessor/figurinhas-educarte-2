import { RARITY_CONFIG } from '../data/stickers';

const SHOWCASE = [
  {
    rarity: 'comum' as const,
    emoji: '🌀',
    chance: '60%',
    description: 'Figurinhas do dia a dia, mas nem por isso sem charme!',
  },
  {
    rarity: 'rara' as const,
    emoji: '💎',
    chance: '25%',
    description: 'Personagens especiais com histórias únicas.',
  },
  {
    rarity: 'lendaria' as const,
    emoji: '👑',
    chance: '10%',
    description: 'Lendas da escola — pulsam ouro e flututam no ar.',
  },
  {
    rarity: 'secreta' as const,
    emoji: '🔮',
    chance: '5%',
    description: 'Figuras misteriosas... existem mesmo? Quem sabe.',
  },
];

export default function RarityShowcase() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2
          style={{
            fontFamily: 'var(--font-sora)',
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: '#fff',
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}
        >
          Tiers de Raridade
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {SHOWCASE.map(({ rarity, emoji, chance, description }) => {
            const cfg = RARITY_CONFIG[rarity];
            return (
              <div
                key={rarity}
                className={`glass card-${rarity} flex flex-col items-center text-center gap-3 p-5`}
              >
                <span style={{ fontSize: '2.5rem' }}>{emoji}</span>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-sora)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    {chance} de chance
                  </p>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
