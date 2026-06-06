import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingParticles from '../components/FloatingParticles';
import { useAuth } from '../hooks/useAuth';

const QUICK_LOGINS = [
  { label: 'Jogador 1', login: 'usuario1', password: '123456', icon: '🎮' },
  { label: 'Jogador 2', login: 'usuario2', password: '123456', icon: '🕹️' },
  { label: 'Admin',    login: 'admin',    password: '123456', icon: '🛡️' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const ok = login(username.trim(), password);
      setLoading(false);
      if (!ok) {
        setError('Usuário ou senha inválidos. Tente novamente.');
        return;
      }

      const role = username.trim() === 'admin' ? 'admin' : 'usuario';
      navigate(role === 'admin' ? '/admin' : '/jogar', { replace: true });
    }, 400);
  }

  function quickLogin(l: string, p: string) {
    setUsername(l);
    setPassword(p);
    setError('');
    setLoading(true);

    setTimeout(() => {
      const ok = login(l, p);
      setLoading(false);
      if (!ok) { setError('Erro inesperado.'); return; }
      const role = l === 'admin' ? 'admin' : 'usuario';
      navigate(role === 'admin' ? '/admin' : '/jogar', { replace: true });
    }, 400);
  }

  return (
    <div
      className="flex items-center justify-center page-enter"
      style={{ minHeight: '100vh', position: 'relative', zIndex: 1, padding: '1rem' }}
    >
      <FloatingParticles />

      <div className="glass w-full max-w-sm p-8 flex flex-col gap-6" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="text-center">
          <span style={{ fontSize: '2.5rem' }}>👋</span>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginTop: 8 }}>
            Bem-vindo de volta
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: 4 }}>
            Entre para abrir seus pacotinhos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario1"
              required
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                padding: '0.625rem 0.875rem',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                width: '100%',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                padding: '0.625rem 0.875rem',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                width: '100%',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
            />
          </div>

          {error && (
            <p style={{ color: '#F87171', fontSize: '0.825rem', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-orange py-3 text-sm w-full"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Quick login */}
        <div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Acesso rápido
          </p>
          <div className="flex gap-2">
            {QUICK_LOGINS.map(({ label, login: l, password: p, icon }) => (
              <button
                key={l}
                onClick={() => quickLogin(l, p)}
                disabled={loading}
                className="btn-ghost py-2 text-xs flex-1 flex flex-col items-center gap-0.5"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
