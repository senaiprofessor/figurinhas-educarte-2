import { Link } from 'react-router-dom';
import FloatingParticles from '../components/FloatingParticles';
import Navbar from '../components/Navbar';
import RarityShowcase from '../components/RarityShowcase';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <FloatingParticles />
      <Navbar showLogin />

      {/* Hero */}
      <main style={{ paddingTop: '4rem' }}>
        <section
          className="page-enter flex flex-col items-center justify-center text-center gap-6 px-4"
          style={{ minHeight: '92vh', paddingTop: '8rem', paddingBottom: '4rem' }}
        >
          <div
            className="glass px-3 py-1"
            style={{ borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Escola Educarte — Temporada 2025</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-sora)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 6vw, 3.75rem)',
              lineHeight: 1.15,
              maxWidth: 700,
              color: '#fff',
            }}
          >
            Colecione as{' '}
            <span style={{ color: '#F97316' }}>Figurinhas</span>{' '}
            dos Alunos da Educarte!
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Abra pacotinhos digitais, colecione figurinhas exclusivas dos seus colegas e descubra os personagens secretos lendários.
          </p>

          <Link to="/login">
            <button className="btn-orange px-8 py-4" style={{ fontSize: '1rem', marginTop: 8 }}>
              🎁 Abrir Meu Pacotinho
            </button>
          </Link>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {[
              { n: '20', label: 'Figurinhas únicas' },
              { n: '4', label: 'Tiers de raridade' },
              { n: '∞', label: 'Pacotes por dia' },
            ].map(({ n, label }) => (
              <div key={label} className="glass px-5 py-3 text-center" style={{ minWidth: 110 }}>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.5rem', color: '#F97316' }}>{n}</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rarity showcase */}
        <RarityShowcase />

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <div className="glass max-w-xl mx-auto p-10 flex flex-col items-center gap-5">
            <span style={{ fontSize: '3rem' }}>🚀</span>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>
              Pronto para começar?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Faça login e comece a abrir seus pacotinhos agora mesmo. Você pode abrir quantos quiser!
            </p>
            <Link to="/login">
              <button className="btn-orange px-8 py-3 text-sm">Entrar agora</button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.8rem',
        }}
      >
        © 2025 Educarte – Todos os direitos reservados
      </footer>
    </div>
  );
}
