import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import {
  Plus, Briefcase, Users, TrendingUp, Clock, Star,
  ChevronRight, Download, Eye, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay }
});

const statusColor = { Active: 'var(--emerald)', Shortlisting: 'var(--amber)', Closed: 'var(--text-muted)' };
const candidateStatusColor = { Recommended: 'badge-emerald', Review: 'badge-amber', Hold: 'badge-violet' };

function ScoreRing({ score }) {
  const r = 22, circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? 'var(--emerald)' : score >= 70 ? 'var(--amber)' : 'var(--violet-light)';
  return (
    <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
      <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={30} cy={30} r={r} fill="none" stroke="var(--border)" strokeWidth={4} />
        <circle cx={30} cy={30} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={circ - fill}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
        {score}
      </div>
    </div>
  );
}

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to jobs posted by this employer
    const qJobs = query(
      collection(db, 'jobs'),
      where('employerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubJobs = onSnapshot(qJobs, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => {
        const data = doc.data();
        // Calculate days open roughly
        const daysOpen = data.createdAt ? Math.floor((Date.now() - data.createdAt.toMillis()) / (1000 * 60 * 60 * 24)) : 0;
        return { id: doc.id, ...data, daysOpen };
      });
      setJobs(jobsData);
      
      // We will leave the shortlist as an empty array until candidates take tests for MVP
      // Future: fetch from `assessments` where jobId in [jobsData.map(j => j.id)]
      setCandidates([]);
      setLoading(false);
    });

    return () => unsubJobs();
  }, [user]);

  const totalApplicants = jobs.reduce((a, j) => a + (j.applicants || 0), 0);
  const totalShortlisted = jobs.reduce((a, j) => a + (j.shortlisted || 0), 0);
  const avgDaysOpen = jobs.length ? Math.round(jobs.reduce((a, j) => a + j.daysOpen, 0) / jobs.length) : 0;

  if (loading) return <div style={{ minHeight: '100vh', paddingTop: 68, paddingLeft: 24, color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, padding: '5rem 1.5rem 3rem', background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <motion.div {...fadeUp()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome back</p>
            <h2 style={{ marginBottom: '0.25rem' }}>{user?.displayName || 'Employer'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
          <Link to="/employer/post" className="btn btn-primary">
            <Plus size={16} /> Post New Role
          </Link>
        </motion.div>

        {/* KPI Cards */}
        <motion.div {...fadeUp(0.1)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Active Roles', value: jobs.filter(j => j.status === 'Active').length, icon: Briefcase, color: 'var(--violet-light)' },
            { label: 'Total Applicants', value: totalApplicants, icon: Users, color: 'var(--cyan)' },
            { label: 'Shortlisted', value: totalShortlisted, icon: Star, color: 'var(--emerald)' },
            { label: 'Avg. Days Open', value: avgDaysOpen, icon: Clock, color: 'var(--amber)' },
          ].map((k, i) => (
            <motion.div key={k.label} {...fadeUp(0.1 + i * 0.05)} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{k.label}</p>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: k.color }}>{k.value}</div>
                </div>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `rgba(${k.color === 'var(--violet-light)' ? '139,92,246' : k.color === 'var(--cyan)' ? '6,182,212' : k.color === 'var(--emerald)' ? '16,185,129' : '245,158,11'},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <k.icon size={18} color={k.color} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {['jobs', 'shortlist'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.6rem 1.25rem', background: 'none', color: activeTab === tab ? 'var(--violet-light)' : 'var(--text-muted)',
              fontWeight: 600, fontSize: '0.9rem', borderBottom: `2px solid ${activeTab === tab ? 'var(--violet-light)' : 'transparent'}`,
              borderRadius: 0, marginBottom: -1, transition: 'all 0.2s'
            }}>
              {tab === 'jobs' ? 'Active Roles' : 'Candidate Shortlist'}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No active roles posted yet.</p>}
            {jobs.map((job, i) => (
              <motion.div key={job.id} {...fadeUp(i * 0.08)} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.5rem' }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1rem' }}>{job.title}</h3>
                    <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>{job.seniority}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: statusColor[job.status] }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[job.status], display: 'inline-block' }} />
                      {job.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>{job.team} · {job.daysOpen} days open</p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {job.skills.map(s => <span key={s} className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{s}</span>)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{job.applicants}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Applicants</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--emerald)' }}>{job.shortlisted}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Shortlisted</div>
                  </div>
                  <button onClick={() => setActiveTab('shortlist')} className="btn btn-secondary btn-sm">
                    View <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Shortlist Tab */}
        {activeTab === 'shortlist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {candidates.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No candidates have completed assessments yet.</p>}
            {candidates.map((c, i) => (
              <motion.div key={c.id} {...fadeUp(i * 0.08)} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 220 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0 }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.exp} · {c.loc}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{c.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <ScoreRing score={c.score} />
                  <span className={`badge ${candidateStatusColor[c.status]}`}>{c.status}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm"><Eye size={14} /> Scorecard</button>
                    <button className="btn btn-emerald btn-sm"><CheckCircle size={14} /> Advance</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
