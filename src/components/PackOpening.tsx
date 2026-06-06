import { useState, useRef, useEffect } from 'react';
import type { Sticker } from '../types';
import { drawSticker } from '../utils/draw';
import { addToCollection } from '../services/storage.service';
import { RARITY_CONFIG } from '../data/stickers';
import StickerCard from './StickerCard';

type Phase = 'idle' | 'shaking' | 'exploding' | 'flipping' | 'revealed';

const PARTICLE_COLORS = ['#F97316', '#60A5FA', '#A855F7', '#F59E0B', '#DC2626', '#fff'];

interface Particle {
  id: number;
  color: string;
  angle: number;
  distance: number;
  size: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length]!,
    angle: (360 / count) * i + Math.random() * 20,
    distance: 80 + Math.random() * 80,
    size: 6 + Math.random() * 8,
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
  const [isFlipped, setIsFlipped] = useState(false);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (shakeRef.current) clearTimeout(shakeRef.current); }, []);

  function handleOpen() {
    if (phase !== 'idle') return;
    setPhase('shaking');

    shakeRef.current = setTimeout(() => {
      const sticker = drawSticker();
      setDrawnSticker(sticker);
      addToCollection(login, { figurinha_id: sticker.id, data: new Date().toISOString() });

      setPhase('exploding');
      setParticles(generateParticles(18));

      setTimeout(() => {
        setPhase('flipping');
        setTimeout(() => {
          setIsFlipped(true);
          setTimeout(() => setPhase('revealed'), 700);
        }, 50);
      }, 700);
    }, 1300);
  }

  function handleReset() {
    setPhase('idle');
    setDrawnSticker(null);
    setParticles([]);
    setIsFlipped(false);
  }

  const cfg = drawnSticker ? RARITY_CONFIG[drawnSticker.rarity] : null;

  return (
    <div className="flex flex-col items-center gap-8 py-8 page-enter">
      <div className="text-center">
        <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff' }}>
          Abrir Pacotinho 🎁
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: 4 }}>
          Clique no envelope para revelar sua figurinha
        </p>
      </div>

      {/* Main stage */}
      <div style={{ position: 'relative', width: 240, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Envelope (idle + shaking) */}
        {(phase === 'idle' || phase === 'shaking') && (
          <div
            ref={envelopeRef}
            onClick={handleOpen}
            className={phase === 'shaking' ? 'envelope-shake' : 'envelope-pulse'}
            style={{
              width: 200,
              height: 260,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              cursor: phase === 'idle' ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              boxShadow: '0 0 40px rgba(249,115,22,0.5)',
              userSelect: 'none',
            }}
          >
            <span style={{ fontSize: '4rem' }}>📦</span>
            <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
              {phase === 'idle' ? 'Clique para abrir!' : '...'}
            </span>
          </div>
        )}

        {/* Explosion particles */}
        {phase === 'exploding' && (
          <div style={{ position: 'relative', width: 200, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem' }}>✨</span>
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
          </div>
        )}

        {/* Card flip */}
        {(phase === 'flipping' || phase === 'revealed') && drawnSticker && (
          <div className="flip-container" style={{ width: 200, height: 260 }}>
            <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}>
              {/* Front (card back pattern) */}
              <div
                className="flip-card-front glass"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '3rem' }}>🃏</span>
              </div>

              {/* Back (actual sticker) */}
              <div
                className="flip-card-back glass"
                style={{ border: `2px solid ${cfg!.color}`, boxShadow: `0 0 30px ${cfg!.color}66` }}
              >
                <StickerCard sticker={drawnSticker} size="lg" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {phase === 'revealed' && (
        <div className="flex flex-col sm:flex-row gap-3 page-enter">
          <button onClick={handleReset} className="btn-orange px-6 py-3 text-sm">
            🎁 Abrir Outro Pacote
          </button>
          <button onClick={onGoToGallery} className="btn-ghost px-6 py-3 text-sm">
            📖 Ver Minha Coleção
          </button>
        </div>
      )}
    </div>
  );
}
