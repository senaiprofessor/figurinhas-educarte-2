import { useState, useRef, useEffect } from 'react';
import type { Sticker, PackType } from '../types';
import { drawSticker } from '../utils/draw';
import { addToCollection } from '../services/storage.service';
import { RARITY_CONFIG } from '../data/stickers';
import StickerCard from './StickerCard';

type Phase = 'idle' | 'zooming' | 'shaking' | 'exploding' | 'rising' | 'flipping' | 'revealed';

const PARTICLE_COLORS = ['#F97316', '#60A5FA', '#A855F7', '#F59E0B', '#DC2626', '#fff'];
const RARE_PARTICLE_COLORS = ['#7C3AED', '#C4B5FD', '#F59E0B', '#A855F7', '#E879F9', '#fff'];
const CONFETTI_EMOJIS = ['🎉', '🎊', '⭐', '💫', '✨', '🌟', '🎈', '🎆'];

interface Particle {
  id: number;
  color: string;
  angle: number;
  distance: number;
  size: number;
}

interface ConfettiPiece {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

function generateParticles(count: number, pack: PackType): Particle[] {
  const colors = pack === 'raro' ? RARE_PARTICLE_COLORS : PARTICLE_COLORS;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length]!,
    angle: (360 / count) * i + Math.random() * 20,
    distance: 100 + Math.random() * 140,
    size: 8 + Math.random() * 12,
  }));
}

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]!,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 16 + Math.random() * 20,
  }));
}

interface PackOpeningProps {
  login: string;
  onGoToGallery: () => void;
}

export default function PackOpening({ login, onGoToGallery }: PackOpeningProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [selectedPack, setSelectedPack] = useState<PackType>('normal');
  const [drawnSticker, setDrawnSticker] = useState<Sticker | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  function t(fn: () => void, delay: number) {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  }

  function handleOpen() {
    if (phase !== 'idle') return;
    setPhase('zooming');

    t(() => {
      setPhase('shaking');

      t(() => {
        const sticker = drawSticker(selectedPack);
        setDrawnSticker(sticker);
        addToCollection(login, { figurinha_id: sticker.id, data: new Date().toISOString() });

        setPhase('exploding');
        setParticles(generateParticles(24, selectedPack));

        t(() => {
          setPhase('rising');

          t(() => {
            setPhase('flipping');

            t(() => {
              setIsFlipped(true);

              t(() => {
                setPhase('revealed');
                setConfetti(generateConfetti(35));
              }, 850);
            }, 50);
          }, 950);
        }, 700);
      }, 1200);
    }, 600);
  }

  function handleReset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('idle');
    setDrawnSticker(null);
    setParticles([]);
    setConfetti([]);
    setIsFlipped(false);
  }

  const cfg = drawnSticker ? RARITY_CONFIG[drawnSticker.rarity] : null;
  const isRare = selectedPack === 'raro';

  const packStyle: React.CSSProperties = {
    width: 240,
    height: 300,
    borderRadius: 20,
    background: isRare
      ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
      : 'linear-gradient(135deg, #F97316, #EA580C)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    boxShadow: isRare
      ? '0 0 80px rgba(124,58,237,0.7), 0 20px 60px rgba(0,0,0,0.5)'
      : '0 0 80px rgba(249,115,22,0.7), 0 20px 60px rgba(0,0,0,0.5)',
    userSelect: 'none',
  };

  return (
    <>
      <div className="flex flex-col items-center gap-8 py-8 page-enter">
        <div className="text-center">
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff' }}>
            Abrir Pacotinho 🎁
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: 4 }}>
            Escolha o tipo de pacotinho e clique para abrir
          </p>
        </div>

        {/* Pack type selector */}
        {phase === 'idle' && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {(['normal', 'raro'] as PackType[]).map((type) => {
              const active = selectedPack === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedPack(type)}
                  style={{
                    padding: '0.5rem 1.4rem',
                    borderRadius: 9999,
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-sora)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active
                      ? `2px solid ${type === 'raro' ? '#A78BFA' : '#F97316'}`
                      : '2px solid rgba(255,255,255,0.15)',
                    background: active
                      ? type === 'raro'
                        ? 'rgba(124,58,237,0.3)'
                        : 'rgba(249,115,22,0.25)'
                      : 'rgba(255,255,255,0.05)',
                    color: active
                      ? type === 'raro' ? '#C4B5FD' : '#FED7AA'
                      : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.2s',
                  }}
                >
                  {type === 'raro' ? '✨ Raro' : '📦 Normal'}
                </button>
              );
            })}
          </div>
        )}

        {/* Idle pack */}
        {phase === 'idle' ? (
          <div
            onClick={handleOpen}
            className="envelope-pulse"
            style={{
              width: 200,
              height: 260,
              borderRadius: 16,
              background: isRare
                ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
                : 'linear-gradient(135deg, #F97316, #EA580C)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              boxShadow: isRare
                ? '0 0 40px rgba(124,58,237,0.5)'
                : '0 0 40px rgba(249,115,22,0.5)',
              userSelect: 'none',
              position: 'relative',
            }}
          >
            {isRare && (
              <span style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(196,181,253,0.4)',
                borderRadius: 9999,
                fontSize: '0.6rem',
                fontFamily: 'var(--font-sora)',
                fontWeight: 700,
                color: '#E9D5FF',
                padding: '2px 7px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                RARO
              </span>
            )}
            <span style={{ fontSize: '4rem' }}>{isRare ? '💜' : '📦'}</span>
            <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
              Clique para abrir!
            </span>
          </div>
        ) : (
          <div style={{
            width: 200,
            height: 260,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.03)',
            border: '2px dashed rgba(255,255,255,0.1)',
          }} />
        )}
      </div>

      {/* Fullscreen overlay */}
      {phase !== 'idle' && (
        <div
          className="pack-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: isRare ? 'rgba(15,5,30,0.88)' : 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 36,
          }}
        >
          {/* Confetti */}
          {phase === 'revealed' && confetti.map((c) => (
            <div
              key={c.id}
              className="confetti-piece"
              style={{
                left: `${c.left}%`,
                fontSize: c.size,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            >
              {c.emoji}
            </div>
          ))}

          {/* Central stage */}
          <div style={{ position: 'relative', width: 260, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {phase === 'zooming' && (
              <div className="pack-zoom-in" style={packStyle}>
                <span style={{ fontSize: '5rem' }}>{isRare ? '💜' : '📦'}</span>
                {isRare && (
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-sora)', fontWeight: 700, color: '#E9D5FF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    ✨ Pacotinho Raro ✨
                  </span>
                )}
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                  Preparando...
                </span>
              </div>
            )}

            {phase === 'shaking' && (
              <div className="pack-center-shake" style={packStyle}>
                <span style={{ fontSize: '5rem' }}>{isRare ? '💜' : '📦'}</span>
                {isRare && (
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-sora)', fontWeight: 700, color: '#E9D5FF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    ✨ Pacotinho Raro ✨
                  </span>
                )}
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                  Abrindo! {isRare ? '🔮' : '🔥'}
                </span>
              </div>
            )}

            {phase === 'exploding' && (
              <>
                <span className="pack-explode-star" style={{ fontSize: '5rem', position: 'absolute', zIndex: 5 }}>
                  {isRare ? '🔮' : '💥'}
                </span>
                {particles.map((p) => {
                  const rad = (p.angle * Math.PI) / 180;
                  const tx = Math.cos(rad) * p.distance;
                  const ty = Math.sin(rad) * p.distance;
                  return (
                    <div
                      key={p.id}
                      className="firework-particle"
                      style={{
                        background: p.color,
                        width: p.size,
                        height: p.size,
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginLeft: -p.size / 2,
                        marginTop: -p.size / 2,
                        animationDuration: '0.7s',
                        ['--tx' as string]: `${tx}px`,
                        ['--ty' as string]: `${ty}px`,
                        transform: `translate(${tx}px, ${ty}px)`,
                        opacity: 0,
                      }}
                    />
                  );
                })}
              </>
            )}

            {(phase === 'rising' || phase === 'flipping' || phase === 'revealed') && drawnSticker && cfg && (
              <div className={phase === 'rising' ? 'card-rise-up' : ''}>
                <div className="flip-container" style={{ width: 240, height: 300 }}>
                  <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}>
                    <div
                      className="flip-card-front glass"
                      style={{
                        background: isRare
                          ? 'linear-gradient(135deg, #3B0764, #7C3AED)'
                          : 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '4rem' }}>{isRare ? '💜' : '🃏'}</span>
                    </div>
                    <div
                      className="flip-card-back glass"
                      style={{
                        border: `3px solid ${cfg.color}`,
                        boxShadow: `0 0 50px ${cfg.color}88`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <StickerCard sticker={drawnSticker} size="lg" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {phase === 'revealed' && (
            <div className="flex flex-col sm:flex-row gap-3 page-enter" style={{ zIndex: 220, position: 'relative' }}>
              <button onClick={handleReset} className="btn-orange px-8 py-3">
                🎁 Abrir Outro Pacote
              </button>
              <button
                onClick={() => { handleReset(); onGoToGallery(); }}
                className="btn-ghost px-8 py-3"
              >
                📖 Ver Minha Coleção
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
