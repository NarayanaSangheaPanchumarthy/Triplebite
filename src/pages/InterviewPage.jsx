import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Bot, Code2, Brain, MessageSquare, CheckCircle, Clock, ChevronRight, Play, Send } from 'lucide-react';

const STEPS = [
  { id: 'intro',     label: 'Introduction',    icon: Bot },
  { id: 'behavioral',label: 'Behavioral',      icon: MessageSquare },
  { id: 'coding',    label: 'Coding Challenge', icon: Code2 },
  { id: 'system',    label: 'System Design',   icon: Brain },
  { id: 'done',      label: 'Submitted',       icon: CheckCircle },
];

const BEHAVIORAL_QUESTIONS = [
  'Tell me about a time you made a critical technical decision with incomplete information. What was your process and what was the outcome?',
  'Describe a situation where you had to push back on a product requirement for technical reasons. How did you handle it?',
];

const CODING_PROMPT = `Given a list of integers, return all pairs that sum to a target value.

Example:
  Input: nums = [1, 4, 7, 2, 6, 3], target = 8
  Output: [[1,7], [2,6]]

Constraints:
  - Each pair should appear only once
  - Return pairs in any order
  - Time complexity: O(n) preferred`;

const SYSTEM_PROMPT = `Design a URL shortening service (like bit.ly) that needs to handle:
  - 100M URLs created per day
  - 10B redirects per day
  - 99.99% availability requirement
  - Analytics: click counts, geographic distribution

Cover: API design, database schema, scaling strategy, and caching.`;

const DEFAULT_CODE = `def two_sum_pairs(nums, target):
    # Your solution here
    seen = set()
    result = []
    
    for num in nums:
        complement = target - num
        if complement in seen:
            result.append([complement, num])
        seen.add(num)
    
    return result

# Tests
print(two_sum_pairs([1, 4, 7, 2, 6, 3], 8))  # [[1,7],[2,6]]
`;

export default function InterviewPage() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({ behavioral: '', behavioral2: '', code: DEFAULT_CODE, system: '' });
  const [submitted, setSubmitted] = useState({});
  const [assessmentId, setAssessmentId] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const docSnap = await getDoc(doc(db, 'jobs', jobId));
      if (docSnap.exists()) {
        setJob(docSnap.data());
      }
    };
    fetchJob();
  }, [jobId]);

  const step = STEPS[stepIdx];
  const next = () => setStepIdx(i => Math.min(i + 1, STEPS.length - 1));
  
  const submitStep = async (key) => { 
    setSubmitted(s => ({ ...s, [key]: true })); 
    
    // Final step submission to Firestore
    if (key === 'system') {
      try {
        // Simulate AI scoring based on text length + some randomness for the MVP
        const probScore = Math.min(98, 60 + Math.floor(Math.random() * 30) + (answers.code.length > 200 ? 5 : 0));
        const commScore = Math.min(98, 65 + Math.floor(Math.random() * 20) + (answers.behavioral.length > 50 ? 10 : 0));
        const codeScore = Math.min(98, 70 + Math.floor(Math.random() * 25));
        const sysScore = Math.min(98, 60 + Math.floor(Math.random() * 30) + (answers.system.length > 100 ? 10 : 0));
        const overallScore = Math.round((probScore + commScore + codeScore + sysScore) / 4);

        const docRef = await addDoc(collection(db, 'assessments'), {
          jobId,
          jobTitle: job?.title || 'Unknown Role',
          employerId: job?.employerId || '',
          employerName: job?.employerName || '',
          candidateId: user.uid,
          candidateName: user.displayName,
          answers,
          scores: { ProblemSolving: probScore, Communication: commScore, CodeQuality: codeScore, SystemThinking: sysScore },
          overallScore,
          status: overallScore >= 80 ? 'Recommended' : 'Review',
          createdAt: serverTimestamp()
        });
        
        setAssessmentId(docRef.id);
      } catch (err) {
        console.error("Error saving assessment", err);
      }
    }
    
    setTimeout(next, 600); 
  };

  const progressPct = (stepIdx / (STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>AI Interview in Progress</span>
          </div>
          <span className="badge badge-violet" style={{ fontSize: '0.72rem' }}>
            {jobId === 'j1' ? 'Staff Backend Engineer · NimbusAI' : 'Senior Platform Engineer · Flowstack'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Clock size={14} /> ~45–60 min total
        </div>
      </div>

      {/* Step nav */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1.5rem' }}>
        <div className="progress-bar" style={{ marginBottom: '0.75rem' }}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: 20, background: i === stepIdx ? 'rgba(124,58,237,0.2)' : 'transparent', flexShrink: 0 }}>
              <s.icon size={12} color={i < stepIdx ? 'var(--emerald)' : i === stepIdx ? 'var(--violet-light)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.75rem', fontWeight: i === stepIdx ? 600 : 400, color: i < stepIdx ? 'var(--emerald)' : i === stepIdx ? 'var(--violet-light)' : 'var(--text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <AnimatePresence mode="wait">

            {/* Intro */}
            {step.id === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-violet)' }}>
                  <Bot size={36} color="#fff" />
                </div>
                <h2 style={{ marginBottom: '1rem' }}>Meet your AI interviewer</h2>
                <p style={{ maxWidth: 520, margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
                  I'm Byte, Triplebite's AI interview engine. This is a fully async interview — complete each section at your own pace. Your responses will be scored against a structured rubric.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem' }}>
                  {[
                    { label: 'Behavioral', detail: '2 questions · ~15 min' },
                    { label: 'Coding', detail: '1 problem · ~20 min' },
                    { label: 'System Design', detail: '1 scenario · ~20 min' },
                  ].map(s => (
                    <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{s.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.detail}</div>
                    </div>
                  ))}
                </div>
                <button onClick={next} className="btn btn-primary btn-lg" style={{ margin: '0 auto' }}>
                  <Play size={18} fill="white" /> Begin Interview
                </button>
              </motion.div>
            )}

            {/* Behavioral */}
            {step.id === 'behavioral' && (
              <motion.div key="behavioral" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={18} color="var(--violet-light)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem' }}>Behavioral Questions</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Answer in your own words — there are no "trick" questions</p>
                  </div>
                </div>
                {BEHAVIORAL_QUESTIONS.map((q, i) => (
                  <div key={i} className="card" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span style={{ background: 'rgba(124,58,237,0.2)', color: 'var(--violet-light)', borderRadius: 6, padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>Q{i + 1}</span>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>{q}</p>
                    </div>
                    <textarea
                      rows={5}
                      placeholder="Share your experience, what you did, and the outcome..."
                      value={i === 0 ? answers.behavioral : answers.behavioral2}
                      onChange={e => setAnswers(a => ({ ...a, [i === 0 ? 'behavioral' : 'behavioral2']: e.target.value }))}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => submitStep('behavioral')} className="btn btn-primary">
                    {submitted.behavioral ? <><CheckCircle size={15} /> Saved</> : <>Save & Continue <ChevronRight size={15} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Coding */}
            {step.id === 'coding' && (
              <motion.div key="coding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code2 size={18} color="var(--cyan)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem' }}>Coding Challenge</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Solve the problem below. Focus on correctness, then optimize.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Problem Statement</h3>
                    <pre style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{CODING_PROMPT}</pre>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#0d1117', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', flex: 1 }}>
                      <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Python 3.11</span>
                      </div>
                      <textarea
                        value={answers.code}
                        onChange={e => setAnswers(a => ({ ...a, code: e.target.value }))}
                        style={{ width: '100%', minHeight: 240, background: 'transparent', border: 'none', padding: '1rem', fontFamily: 'monospace', fontSize: '0.83rem', color: '#e2e8f0', resize: 'vertical', lineHeight: 1.6 }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button onClick={() => submitStep('code')} className="btn btn-primary">
                    {submitted.code ? <><CheckCircle size={15} /> Submitted</> : <>Submit Solution <Send size={15} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* System Design */}
            {step.id === 'system' && (
              <motion.div key="system" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={18} color="var(--emerald-light)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem' }}>System Design</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Think at scale. Cover trade-offs and your rationale.</p>
                  </div>
                </div>
                <div className="card" style={{ marginBottom: '1.25rem', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
                  <pre style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{SYSTEM_PROMPT}</pre>
                </div>
                <textarea
                  rows={14}
                  placeholder="Walk through your design. Consider: API endpoints, data models, caching strategy, database choice, CDN, load balancing, failure modes..."
                  value={answers.system}
                  onChange={e => setAnswers(a => ({ ...a, system: e.target.value }))}
                  style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button onClick={() => submitStep('system')} className="btn btn-primary">
                    {submitted.system ? <><CheckCircle size={15} /> Submitted</> : <>Submit Design <Send size={15} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Done */}
            {step.id === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid rgba(16,185,129,0.3)' }}>
                  <CheckCircle size={44} color="var(--emerald)" />
                </div>
                <h2 style={{ marginBottom: '0.75rem' }}>Interview Complete!</h2>
                <p style={{ maxWidth: 480, margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
                  Your responses have been submitted for AI scoring. You'll receive your feedback report within 24 hours, and it will be shared with the employer's hiring team.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate(assessmentId ? `/scorecard/${assessmentId}` : '/candidate')} className="btn btn-primary">
                    View My Scorecard <ChevronRight size={16} />
                  </button>
                  <button onClick={() => navigate('/candidate')} className="btn btn-secondary">
                    Back to Dashboard
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
