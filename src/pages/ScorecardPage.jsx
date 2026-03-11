import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CheckCircle, Star, Download, Share2, ArrowLeft, TrendingUp, MessageSquare, Code2, Brain, Target } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay }
});

function ScoreRing({ score, size = 120, strokeWidth = 8 }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? 'var(--emerald)' : score >= 70 ? 'var(--amber)' : 'var(--violet-light)';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - fill }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: size === 120 ? '2rem' : '0.9rem', fontWeight: 800, fontFamily: 'Space Grotesk' }}>{score}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 100</div>
      </div>
    </div>
  );
}

function DimBar({ score, color }) {
  return (
    <div className="progress-bar" style={{ height: 6, flex: 1 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        style={{ height: '100%', background: color, borderRadius: 3 }}
      />
    </div>
  );
}

export default function ScorecardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      // For demo fallback if someone manually goes to /scorecard/demo
      if (id === 'demo' || !id) {
        setAssessment({
          overallScore: 87,
          scores: { ProblemSolving: 91, Communication: 87, CodeQuality: 88, SystemThinking: 83 },
          candidateName: 'Jordan Kim',
          jobTitle: 'Staff Backend Engineer',
          employerName: 'NimbusAI',
          createdAt: { toDate: () => new Date('2026-03-10T14:00:00Z') },
          status: 'Recommended'
        });
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'assessments', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAssessment(docSnap.data());
        }
      } catch (err) {
        console.error("Failed to load assessment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', paddingTop: 68, paddingLeft: 24, color: 'var(--text-muted)' }}>Loading...</div>;
  if (!assessment) return <div style={{ minHeight: '100vh', paddingTop: 68, paddingLeft: 24, color: '#f87171' }}>Assessment not found.</div>;

  const isHire = assessment.overallScore >= 80;
  
  const DIMENSIONS = [
    { label: 'Problem Solving', icon: Target, score: assessment.scores?.ProblemSolving || 0, color: 'var(--violet-light)', feedback: 'Evaluated based on algorithm efficiency, edge cases, and time complexity.' },
    { label: 'Communication', icon: MessageSquare, score: assessment.scores?.Communication || 0, color: 'var(--cyan)', feedback: 'Evaluated based on clarity, structure of responses, and rationale articulation.' },
    { label: 'Code Quality', icon: Code2, score: assessment.scores?.CodeQuality || 0, color: 'var(--emerald-light)', feedback: 'Evaluated based on readability, variable naming, and standard practices.' },
    { label: 'System Thinking', icon: Brain, score: assessment.scores?.SystemThinking || 0, color: 'var(--amber)', feedback: 'Evaluated based on architectural coverage, scale considerations, and database choices.' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, padding: '5rem 1.5rem 3rem' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Back */}
        <motion.button {...fadeUp()} onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={14} /> Back
        </motion.button>

        {/* Header */}
        <motion.div {...fadeUp(0.05)} className="card" style={{
          padding: '2.5rem', marginBottom: '1.5rem', textAlign: 'center',
          background: isHire ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.06))' : 'var(--bg-card)',
          borderColor: isHire ? 'rgba(16,185,129,0.3)' : 'var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <ScoreRing score={assessment.overallScore} size={140} strokeWidth={10} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <span className={`badge ${isHire ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {isHire ? <><CheckCircle size={14} /> Strong Hire Recommendation</> : <><Star size={14} /> Consider with Note</>}
            </span>
          </div>
          <h2 style={{ marginBottom: '0.35rem' }}>{assessment.candidateName}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{assessment.jobTitle} · {assessment.employerName}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Assessment completed {assessment.createdAt?.toDate ? new Date(assessment.createdAt.toDate()).toLocaleDateString() : 'recently'} · ~50 minutes</p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm"><Download size={14} /> Export PDF</button>
            <button className="btn btn-secondary btn-sm"><Share2 size={14} /> Share link</button>
            {isHire && <button className="btn btn-emerald btn-sm"><CheckCircle size={14} /> Advance to offer</button>}
          </div>
        </motion.div>

        {/* Dimension scores */}
        <motion.div {...fadeUp(0.15)} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />Score Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {DIMENSIONS.map((d, i) => (
              <motion.div key={d.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `rgba(${d.color === 'var(--violet-light)' ? '139,92,246' : d.color === 'var(--cyan)' ? '6,182,212' : d.color === 'var(--emerald-light)' ? '52,211,153' : '245,158,11'},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <d.icon size={15} color={d.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.label}</span>
                      <span style={{ fontWeight: 700, color: d.color }}>{d.score}</span>
                    </div>
                    <DimBar score={d.score} color={d.color} />
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: '3rem', lineHeight: 1.6 }}>{d.feedback}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div {...fadeUp(0.3)} className="card" style={{ background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={14} color="var(--violet-light)" />
            </div>
            <h3 style={{ fontSize: '0.95rem' }}>AI Summary for Hiring Manager</h3>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            {assessment.candidateName.split(' ')[0]} demonstrates <strong style={{ color: 'var(--text-primary)' }}>{isHire ? 'strong' : 'moderate'} technical capability</strong>. The coding challenge solution was {isHire ? 'optimal and well-structured' : 'functional but lacked optimization'}. Behavioral responses showed {isHire ? 'clear leadership instincts' : 'average communication skills'}.
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            The system design response covered core components {isHire ? 'extensively' : 'adequately'} and could benefit from continuous practice. <strong style={{ color: isHire ? 'var(--emerald)' : 'var(--amber)' }}>{isHire ? 'Recommended to advance to technical conversation with your CTO.' : 'Review answers manually before deciding.'}</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
