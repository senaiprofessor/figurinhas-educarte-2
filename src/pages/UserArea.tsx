import { useState, useEffect } from 'react';
import FloatingParticles from '../components/FloatingParticles';
import Navbar from '../components/Navbar';
import PackOpening from '../components/PackOpening';
import Gallery from '../components/Gallery';
import { useAuth } from '../hooks/useAuth';
import { getCollection } from '../services/storage.service';
import type { CollectedEntry } from '../types';

type Tab = 'open' | 'gallery';

export default function UserArea() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('open');
  const [collection, setCollection] = useState<CollectedEntry[]>([]);

  useEffect(() => {
    if (user) setCollection(getCollection(user.login));
  }, [user, tab]);

  if (!user) return null;

  const tabStyle = (active: boolean) => ({
    padding: '0.5rem 1.25rem',
    borderRadius: 9999,
    fontSize: '0.875rem',
    fontFamily: 'var(--font-sora)',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'rgba(255,255,255,0.08)',
    color: '#fff',
    boxShadow: active ? '0 0 16px rgba(249,115,22,0.4)' : 'none',
  });

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <FloatingParticles />
      <Navbar />

      <main style={{ paddingTop: '5rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 page-enter">
            <div>
              <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff' }}>
                Olá, {user.displayName}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: 4 }}>
                {collection.length} figurinha{collection.length !== 1 ? 's' : ''} na coleção
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button style={tabStyle(tab === 'open')} onClick={() => setTab('open')}>
                🎁 Abrir Pacote
              </button>
              <button style={tabStyle(tab === 'gallery')} onClick={() => setTab('gallery')}>
                📖 Coleção
              </button>
            </div>
          </div>

          {/* Content */}
          {tab === 'open' && (
            <PackOpening
              login={user.login}
              onGoToGallery={() => { setCollection(getCollection(user.login)); setTab('gallery'); }}
            />
          )}

          {tab === 'gallery' && (
            <Gallery collection={collection} />
          )}
        </div>
      </main>
    </div>
  );
}
