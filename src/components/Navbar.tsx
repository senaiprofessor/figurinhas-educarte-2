import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  showLogin?: boolean;
}

export default function Navbar({ showLogin = false }: NavbarProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem' }}>
            <span style={{ color: '#F97316' }}>Figurinhas</span>{' '}
            <span style={{ color: '#fff' }}>Educarte</span>
          </span>
        </Link>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                Olá, <strong style={{ color: '#fff' }}>{user.displayName}</strong>
              </span>
              <button
                onClick={logout}
                className="btn-ghost px-4 py-2 text-sm"
              >
                Sair
              </button>
            </>
          ) : showLogin ? (
            <Link to="/login">
              <button className="btn-orange px-5 py-2 text-sm">Entrar</button>
            </Link>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(3px, 7px)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(3px, -7px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{ background: 'rgba(15,23,42,0.95)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem' }}
          className="md:hidden flex flex-col gap-3"
        >
          {user ? (
            <>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                Olá, <strong style={{ color: '#fff' }}>{user.displayName}</strong>
              </span>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-ghost px-4 py-2 text-sm w-full">
                Sair
              </button>
            </>
          ) : showLogin ? (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="btn-orange px-5 py-2 text-sm w-full">Entrar</button>
            </Link>
          ) : null}
        </div>
      )}
    </nav>
  );
}
