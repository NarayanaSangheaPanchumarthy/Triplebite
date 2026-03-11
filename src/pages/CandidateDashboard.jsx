import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import {
  User, Clock, Star, CheckCircle, ArrowRight, Play,
  FileText, Zap, TrendingUp, Bell
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay }
});

const profileItems = [
  { label: 'Work history', done: true },
  { label: 'Skills & technologies', done: true },
  { label: 'GitHub / portfolio link', done: true },
  { label: 'Compensation preferences', done: false },
  { label: 'Work authorization', done: false },
];
const profilePct = Math.round((profileItems.filter(i => i.done).length / profileItems.length) * 100);

function ScoreRing({ score }) {
  const r = 22, circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? 'var(--emerald)' : score >= 70 ? 'var(--amber)' : 'var(--violet-light)';
  return (
    <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
      <svg width={56} height={56} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={28} cy={28} r={r} fill="none" stroke="var(--border)" strokeWidth={4} />
        <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={circ - fill} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
        {score}
      </div>
    </div>
  );
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch all active jobs to simulate an open invitation board for candidates
    const qJobs = query(collection(db, 'jobs'), where('status', '==', 'Active'), orderBy('createdAt', 'desc'));
    const unsubJobs = onSnapshot(qJobs, (snapshot) => {
      setInvitations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch completed assessments for this candidate
    const qCompleted = query(collection(db, 'assessments'), where('candidateId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubCompleted = onSnapshot(qCompleted, (snapshot) => {
      setCompleted(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => { unsubJobs(); unsubCompleted(); };
  }, [user]);

  if (loading) return <div style={{ minHeight: '100vh', paddingTop: 68, paddingLeft: 24, color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, padding: '5rem 1.5rem 3rem' }}>
      <div className="container">
        {/* Header */}
        <motion.div {...fadeUp()} style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Candidate Portal</p>
          <h2 style={{ marginBottom: '0.25rem' }}>Hey, {user?.displayName?.split(' ')[0] || 'Jordan'} 👋</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You have {invitations.length} active open roles{invitations.length !== 1 ? 's' : ''}</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left column */}
          <div>
            {/* Invitations */}
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <Bell size={15} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />Interview Invitations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {invitations.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No open roles available right now.</p>}
                {invitations.map((inv, i) => (
                  <motion.div key={inv.id} {...fadeUp(0.1 + i * 0.1)} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0 }}>
                          {inv.employerName ? inv.employerName[0] : 'C'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '1rem' }}>{inv.title}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{inv.employerName || 'Triplebite'}</div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>{inv.seniority || 'Any'}</span>
                            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>${inv.salary_min}k – ${inv.salary_max}k</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                          <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                          Open Role
                        </div>
                        <button onClick={() => navigate(`/interview/${inv.id}`)} className="btn btn-primary btn-sm">
                          <Play size={13} /> Start Interview
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <Zap size={12} color="var(--violet-light)" style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
                      AI-conducted · ~{inv.duration || 60} min · Async (complete at your pace)
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Completed */}
            {completed.length > 0 && (
              <motion.div {...fadeUp(0.3)}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <CheckCircle size={15} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />Completed Interviews
                </h3>
                {completed.map(c => (
                  <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.jobTitle}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{c.employerName} · {new Date(c.createdAt?.toDate()).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--emerald)', marginTop: '0.3rem' }}>{c.status}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <ScoreRing score={c.overallScore} />
                      <button onClick={() => navigate(`/scorecard/${c.id}`)} className="btn btn-secondary btn-sm">
                        <FileText size={13} /> View Report
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Profile completeness */}
            <motion.div {...fadeUp(0.15)} className="card">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
                <User size={15} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />Profile — {profilePct}%
              </h3>
              <div className="progress-bar" style={{ marginBottom: '1.25rem' }}>
                <div className="progress-fill" style={{ width: `${profilePct}%` }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {profileItems.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.83rem', color: item.done ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    <CheckCircle size={13} color={item.done ? 'var(--emerald)' : 'var(--border)'} />
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.2)} className="card">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
                <TrendingUp size={15} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />Your Stats
              </h3>
              {[
                { label: 'Interviews taken', value: 1 },
                { label: 'Employers viewing', value: 3 },
                { label: 'Profile views (30d)', value: 14 },
                { label: 'Response rate', value: '100%' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
