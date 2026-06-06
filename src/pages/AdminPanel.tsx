import { useState, useEffect } from 'react';
import FloatingParticles from '../components/FloatingParticles';
import Navbar from '../components/Navbar';
import BarChart from '../components/BarChart';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../hooks/useAuth';
import { getAllData, clearAllData } from '../services/storage.service';
import { stickers, RARITY_CONFIG } from '../data/stickers';
import type { Rarity } from '../types';

interface HistoryRow {
  user: string;
  emoji: string;
  name: string;
  rarity: Rarity;
  timestamp: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<Rarity, number>>({ comum: 0, rara: 0, lendaria: 0, secreta: 0 });
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadData() {
    const data = getAllData();
    const rows: HistoryRow[] = [];
    const newCounts: Record<Rarity, number> = { comum: 0, rara: 0, lendaria: 0, secreta: 0 };

    for (const [login, entries] of Object.entries(data)) {
      for (const entry of entries) {
        const sticker = stickers.find((s) => s.id === entry.figurinha_id);
        if (!sticker) continue;
        newCounts[sticker.rarity]++;
        rows.push({ user: login, emoji: sticker.emoji, name: sticker.name, rarity: sticker.rarity, timestamp: entry.data });
      }
    }

    rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setCounts(newCounts);
    setTotal(rows.length);
    setHistory(rows);
  }

  useEffect(() => { loadData(); }, []);

  function handleClear() {
    clearAllData();
    setConfirmOpen(false);
    loadData();
  }

  if (!user) return null;

  const statCards = [
    { label: 'Total Distribuídas', value: total, color: '#3B82F6', icon: '📦' },
    { label: 'Comuns', value: counts.comum, color: RARITY_CONFIG.comum.color, icon: '🌀' },
    { label: 'Raras', value: counts.rara, color: RARITY_CONFIG.rara.color, icon: '💎' },
    { label: 'Lendárias', value: counts.lendaria, color: RARITY_CONFIG.lendaria.color, icon: '👑' },
    { label: 'Secretas', value: counts.secreta, color: RARITY_CONFIG.secreta.color, icon: '🔮' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <FloatingParticles />
      <Navbar />

      <main style={{ paddingTop: '5rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 page-enter">
            <div>
              <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff' }}>
                Painel Administrativo
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: 4 }}>
                Visão geral da plataforma Figurinhas Educarte
              </p>
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              className="btn-orange px-4 py-2 text-sm"
              style={{ background: 'linear-gradient(135deg, #DC2626, #991B1B)' }}
            >
              🗑️ Limpar Dados
            </button>
          </div>

          {/* Stat cards */}
          <div
            className="page-enter"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {statCards.map(({ label, value, color, icon }) => (
              <div key={label} className="glass p-5 flex flex-col gap-2">
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '2rem', color }}>
                  {value}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.3 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="mb-6 page-enter">
            <BarChart counts={counts} total={total} />
          </div>

          {/* History table */}
          <div className="glass p-5 page-enter">
            <h3 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>
              Histórico Completo de Resgates
            </h3>

            {history.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
                Nenhuma figurinha distribuída ainda.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      {['Usuário', 'Figurinha', 'Nome', 'Raridade', 'Obtida em'].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: 'left',
                            padding: '0.5rem 0.75rem',
                            color: 'rgba(255,255,255,0.5)',
                            fontFamily: 'var(--font-sora)',
                            fontWeight: 600,
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            whiteSpace: 'nowrap',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            fontSize: '0.7rem',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row, i) => {
                      const cfg = RARITY_CONFIG[row.rarity];
                      return (
                        <tr
                          key={i}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.04)')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = 'transparent')}
                        >
                          <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                            {row.user}
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', fontSize: '1.25rem' }}>{row.emoji}</td>
                          <td style={{ padding: '0.6rem 0.75rem', color: '#fff', whiteSpace: 'nowrap' }}>{row.name}</td>
                          <td style={{ padding: '0.6rem 0.75rem' }}>
                            <span
                              className="rarity-badge"
                              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}
                            >
                              {cfg.label}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {formatDate(row.timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {confirmOpen && (
        <ConfirmModal
          title="Limpar todos os dados?"
          message="Esta ação apagará TODAS as coleções de TODOS os usuários permanentemente. Esta operação não pode ser desfeita."
          confirmLabel="Sim, limpar tudo"
          onConfirm={handleClear}
          onCancel={() => setConfirmOpen(false)}
          danger
        />
      )}
    </div>
  );
}
