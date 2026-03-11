import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Briefcase, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null); // 'employer' | 'candidate'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    
    try {
      await loginWithGoogle(selected);
      navigate(selected === 'employer' ? '/employer' : '/candidate');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'employer',
      icon: Briefcase,
      title: 'I\'m hiring',
      subtitle: 'Post roles, review AI scorecards, shortlist top engineers',
      perks: ['AI-ranked candidate shortlists', 'Employer dashboard & ATS integration', '90-day placement guarantee'],
    },
    {
      id: 'candidate',
      icon: User,
      title: 'I\'m a candidate',
      subtitle: 'Take async technical interviews and get matched to top startups',
      perks: ['Async interview — no scheduling', 'Instant feedback after assessment', 'Matched to curated startup roles'],
    },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: 68, padding: '5rem 1.5rem',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 760 }}>
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--violet-glow)' }}>
              <Zap size={20} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.4rem' }}>
              Triple<span style={{ color: 'var(--violet-light)' }}>bite</span>
            </span>
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Welcome aboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Choose your role to get started</p>
        </motion.div>

        {/* Role cards */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {roles.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(r.id)}
              style={{
                background: selected === r.id ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)',
                border: `2px solid ${selected === r.id ? 'var(--violet-light)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'left',
                transition: 'all 0.25s',
                cursor: 'pointer',
                boxShadow: selected === r.id ? 'var(--shadow-violet)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: selected === r.id ? 'rgba(124,58,237,0.3)' : 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <r.icon size={22} color={selected === r.id ? 'var(--violet-light)' : 'var(--text-secondary)'} />
                </div>
                {selected === r.id && <CheckCircle size={20} color="var(--emerald)" />}
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: selected === r.id ? 'var(--text-primary)' : 'var(--text-primary)' }}>{r.title}</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>{r.subtitle}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {r.perks.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={13} color="var(--emerald)" /> {p}
                  </div>
                ))}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Continue button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <button
            onClick={handleContinue}
            disabled={!selected || loading}
            className="btn btn-primary btn-lg w-full"
            style={{
              width: '100%', justifyContent: 'center',
              opacity: selected ? 1 : 0.45,
              cursor: selected ? 'pointer' : 'default',
            }}
          >
            {loading ? 'Signing in with Google...' : 'Continue with Google'} {!loading && <ArrowRight size={18} />}
          </button>
          
          {error && <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#f87171', marginTop: '1rem' }}>{error}</p>}
          
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            Requires a Google Account to sign in
          </p>
        </motion.div>
      </div>
    </div>
  );
}
