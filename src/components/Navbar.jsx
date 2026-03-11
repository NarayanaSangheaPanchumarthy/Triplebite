import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, LogOut, User, Briefcase } from 'lucide-react';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const dashLink = role === 'employer' ? '/employer' : '/candidate';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 1.5rem',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(8,11,20,0.85)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px var(--violet-glow)',
          }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
            Triple<span style={{ color: 'var(--violet-light)' }}>bite</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="flex items-center gap-3" style={{ display: 'flex' }}>
          <Link to="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, padding: '0.4rem 0.75rem', borderRadius: 6, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color='var(--text-primary)'}
            onMouseLeave={e => e.target.style.color='var(--text-secondary)'}
          >Pricing</Link>

          {user ? (
            <>
              <Link to={dashLink} className="btn btn-secondary btn-sm">
                {role === 'employer' ? <Briefcase size={14} /> : <User size={14} />}
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn btn-secondary btn-sm">Sign in</Link>
              <Link to="/auth" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
