import { useState, useRef, useEffect } from 'react';
import type { Sticker } from '../types';
import { drawSticker } from '../utils/draw';
import { addToCollection } from '../services/storage.service';
import { RARITY_CONFIG } from '../data/stickers';
import StickerCard from './StickerCard';

type Phase = 'idle' | 'zooming' | 'shaking' | 'exploding' | 'rising' | 'flipping' | 'revealed';

const PARTICLE_COLORS = ['#F97316', '#60A5FA', '#A855F7', '#F59E0B', '#DC2626', '#fff'];
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

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length]!,
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
        const sticker = drawSticker();
        setDrawnSticker(sticker);
        addToCollection(login, { figurinha_id: sticker.id, data: new Date().toISOString() });

        setPhase('exploding');
        setParticles(generateParticles(24));

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

  const packStyle: React.CSSProperties = {
    width: 240,
    height: 300,
    borderRadius: 20,
    background: 'linear-gradient(135deg, #F97316, #EA580C)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    boxShadow: '0 0 80px rgba(249,115,22,0.7), 0 20px 60px rgba(0,0,0,0.5)',
    userSelect: 'none',
  };

  return (
    <>
      {/* Page content */}
      <div className="flex flex-col items-center gap-8 py-8 page-enter">
        <div className="text-center">
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff' }}>
            Abrir Pacotinho 🎁
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: 4 }}>
            Clique no envelope para revelar sua figurinha
          </p>
        </div>

        {phase === 'idle' ? (
          <div
            onClick={handleOpen}
            className="envelope-pulse"
            style={{
              width: 200, height: 260, borderRadius: 16,
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
              boxShadow: '0 0 40px rgba(249,115,22,0.5)',
              userSelect: 'none',
            }}
          >
            <span style={{ fontSize: '4rem' }}>📦</span>
            <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
              Clique para abrir!
            </span>
          </div>
        ) : (
          <div style={{
            width: 200, height: 260, borderRadius: 16,
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
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 36,
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

            {/* Pack zooming in */}
            {phase === 'zooming' && (
              <div className="pack-zoom-in" style={packStyle}>
                <span style={{ fontSize: '5rem' }}>📦</span>
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                  Preparando...
                </span>
              </div>
            )}

            {/* Pack shaking */}
            {phase === 'shaking' && (
              <div className="pack-center-shake" style={packStyle}>
                <span style={{ fontSize: '5rem' }}>📦</span>
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                  Abrindo! 🔥
                </span>
              </div>
            )}

            {/* Explosion */}
            {phase === 'exploding' && (
              <>
                <span className="pack-explode-star" style={{ fontSize: '5rem', position: 'absolute', zIndex: 5 }}>💥</span>
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

            {/* Card: rising → flipping → revealed (same element, avoids position jump) */}
            {(phase === 'rising' || phase === 'flipping' || phase === 'revealed') && drawnSticker && cfg && (
              <div className={phase === 'rising' ? 'card-rise-up' : ''}>
                <div className="flip-container" style={{ width: 240, height: 300 }}>
                  <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}>
                    <div
                      className="flip-card-front glass"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '4rem' }}>🃏</span>
                    </div>
                    <div
                      className="flip-card-back glass"
                      style={{
                        border: `3px solid ${cfg.color}`,
                        boxShadow: `0 0 50px ${cfg.color}88`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <StickerCard sticker={drawnSticker} size="lg" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
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
