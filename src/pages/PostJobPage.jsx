import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, ArrowRight, ArrowLeft, Briefcase, Code2, Brain, Target } from 'lucide-react';

const steps = [
  { id: 1, label: 'Role Details', icon: Briefcase },
  { id: 2, label: 'Skills & Level', icon: Target },
  { id: 3, label: 'Interview Config', icon: Brain },
  { id: 4, label: 'Review & Post', icon: CheckCircle },
];

const seniorities = ['Senior (5–8 yrs)', 'Staff (8–12 yrs)', 'Principal (12+ yrs)', 'Engineering Manager'];
const skillOptions = ['React', 'TypeScript', 'Node.js', 'Go', 'Rust', 'Python', 'Java', 'Kubernetes', 'AWS', 'PostgreSQL', 'GraphQL', 'PyTorch', 'CUDA', 'Terraform', 'Redis'];
const assessmentTypes = [
  { id: 'algo', label: 'Algorithm & Data Structures', desc: 'LeetCode-style problems, complexity analysis' },
  { id: 'system', label: 'System Design', desc: 'Architecture, scalability, trade-offs' },
  { id: 'behavioral', label: 'Behavioral & Leadership', desc: 'Structured STAR-format prompts' },
  { id: 'domain', label: 'Domain-Specific Deep Dive', desc: 'Role-specific technical scenarios' },
];

export default function PostJobPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', team: '', description: '', seniority: '', salary_min: '', salary_max: '',
    skills: [], assessments: [], duration: '60', notes: ''
  });
  const [posted, setPosted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const toggleSkill = s => update('skills', form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);
  const toggleAssess = a => update('assessments', form.assessments.includes(a) ? form.assessments.filter(x => x !== a) : [...form.assessments, a]);

  const handlePost = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        ...form,
        employerId: user.uid,
        employerName: user.displayName,
        status: 'Active',
        applicants: 0,
        shortlisted: 0,
        createdAt: serverTimestamp(),
      });
      setPosted(true);
      setTimeout(() => navigate('/employer'), 2000);
    } catch (error) {
      console.error("Error posting job:", error);
      setIsSubmitting(false);
    }
  };

  if (posted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <CheckCircle size={40} color="var(--emerald)" />
        </div>
        <h2>Role Posted!</h2>
        <p style={{ marginTop: '0.5rem' }}>AI candidate matching has begun. Expect your shortlist in 21 days.</p>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, padding: '5rem 1.5rem 3rem' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Post a New Role</h2>
          <p style={{ marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>Configure your role and AI interview criteria</p>

          {/* Step progress */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: step >= s.id ? '100%' : '0%' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <s.icon size={11} color={step >= s.id ? 'var(--violet-light)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.72rem', color: step >= s.id ? 'var(--violet-light)' : 'var(--text-muted)', fontWeight: step === s.id ? 600 : 400 }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem' }}>Role Details</h3>
                <div className="form-group">
                  <label>Job Title *</label>
                  <input placeholder="e.g. Staff Backend Engineer" value={form.title} onChange={e => update('title', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Team / Department</label>
                    <input placeholder="e.g. Infrastructure" value={form.team} onChange={e => update('team', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Seniority Level</label>
                    <select value={form.seniority} onChange={e => update('seniority', e.target.value)}>
                      <option value="">Select level</option>
                      {seniorities.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Min Salary ($K/yr)</label>
                    <input type="number" placeholder="200" value={form.salary_min} onChange={e => update('salary_min', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Max Salary ($K/yr)</label>
                    <input type="number" placeholder="260" value={form.salary_max} onChange={e => update('salary_max', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Role Description</label>
                  <textarea rows={4} placeholder="What will this engineer own? What are the key challenges?" value={form.description} onChange={e => update('description', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem' }}>Skills Required</h3>
                <p style={{ fontSize: '0.875rem' }}>Select the key technologies this role requires</p>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {skillOptions.map(s => (
                    <button key={s} onClick={() => toggleSkill(s)} style={{
                      padding: '0.4rem 1rem', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500,
                      background: form.skills.includes(s) ? 'rgba(124,58,237,0.2)' : 'var(--bg-secondary)',
                      border: `1.5px solid ${form.skills.includes(s) ? 'var(--violet-light)' : 'var(--border)'}`,
                      color: form.skills.includes(s) ? 'var(--violet-light)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>{s}</button>
                  ))}
                </div>
                {form.skills.length > 0 && (
                  <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Selected: <strong style={{ color: 'var(--violet-light)' }}>{form.skills.join(', ')}</strong>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem' }}>Interview Configuration</h3>
                <p style={{ fontSize: '0.875rem' }}>Choose which assessment modules to include</p>
                {assessmentTypes.map(a => (
                  <div key={a.id} onClick={() => toggleAssess(a.id)} style={{
                    padding: '1rem', borderRadius: 10,
                    border: `1.5px solid ${form.assessments.includes(a.id) ? 'var(--violet-light)' : 'var(--border)'}`,
                    background: form.assessments.includes(a.id) ? 'rgba(124,58,237,0.1)' : 'var(--bg-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{a.desc}</div>
                    </div>
                    {form.assessments.includes(a.id) && <CheckCircle size={18} color="var(--emerald)" />}
                  </div>
                ))}
                <div className="form-group">
                  <label>Estimated interview duration (minutes)</label>
                  <select value={form.duration} onChange={e => update('duration', e.target.value)}>
                    {['30', '45', '60', '90'].map(d => <option key={d} value={d}>{d} minutes</option>)}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1rem' }}>Review & Post</h3>
                {[
                  { label: 'Job Title', value: form.title || '—' },
                  { label: 'Team', value: form.team || '—' },
                  { label: 'Seniority', value: form.seniority || '—' },
                  { label: 'Compensation', value: form.salary_min && form.salary_max ? `$${form.salary_min}K–$${form.salary_max}K` : '—' },
                  { label: 'Skills', value: form.skills.length ? form.skills.join(', ') : '—' },
                  { label: 'Assessments', value: form.assessments.length ? form.assessments.join(', ') : '—' },
                  { label: 'Interview Time', value: `${form.duration} minutes` },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '60%' }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--emerald)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  AI candidate matching will start within 24 hours. Your shortlist of top 3–5 candidates will be ready within 21 days.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/employer')} className="btn btn-secondary">
              <ArrowLeft size={16} /> {step === 1 ? 'Cancel' : 'Back'}
            </button>
            {step < 4
              ? <button onClick={() => setStep(s => s + 1)} className="btn btn-primary">Next <ArrowRight size={16} /></button>
              : <button onClick={handlePost} className="btn btn-emerald">Post Role <CheckCircle size={16} /></button>
            }
          </div>
        </motion.div>
      </div>
    </div>
  );
}
