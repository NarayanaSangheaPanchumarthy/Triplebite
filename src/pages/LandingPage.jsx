import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, ArrowRight, CheckCircle, Users, TrendingUp, Shield,
  Star, Code2, Brain, Clock, Award, ChevronRight, Bot
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay }
});

const features = [
  { icon: Bot, title: 'AI Interview Engine', desc: 'Adaptive technical assessments calibrated to seniority level. Real-time code execution with behavioral analysis.', color: 'var(--violet-light)' },
  { icon: Clock, title: '21-Day Shortlist', desc: 'Surface your top 3–5 ranked candidates in under 3 weeks. AI scorecard summaries eliminate hours of review.', color: 'var(--cyan)' },
  { icon: Shield, title: '90-Day Guarantee', desc: 'Every placement backed by a 90-day replacement guarantee. We share your risk so you hire with confidence.', color: 'var(--emerald-light)' },
  { icon: Brain, title: 'Bias-Mitigated Scoring', desc: 'EEOC-compliant structured interview rubrics. Quarterly bias audits published via public summary reports.', color: 'var(--amber)' },
  { icon: Code2, title: 'Live Code Sandbox', desc: 'Candidates code in a real browser sandbox. No setup friction — supports 20+ languages with test runners.', color: 'var(--violet-light)' },
  { icon: Award, title: 'Instant Candidate Feedback', desc: 'Every candidate receives a post-interview report. Better experience means stronger talent pool retention.', color: 'var(--cyan)' },
];

const stats = [
  { value: '35%+', label: 'On-site-to-hire rate', sub: 'vs. 12% industry average' },
  { value: '21 days', label: 'Time to shortlist', sub: 'vs. 45-60 day standard' },
  { value: '90 day', label: 'Placement guarantee', sub: 'Full replacement, no fee' },
  { value: '25%', label: 'Success-based fee', sub: 'No hire, no charge' },
];

const competitors = [
  { name: 'Triplebite', price: '25% (success)', speed: '< 21 days', ai: '✓ Full AI engine', guarantee: '90 days', highlight: true },
  { name: 'Karat', price: '$500–$1,500/interview', speed: '4–6 wks', ai: 'Human-assisted', guarantee: '—' },
  { name: 'Wellfound', price: 'Self-serve', speed: 'Varies', ai: 'No', guarantee: '—' },
  { name: 'Toptal', price: '20–40% margin', speed: '2–4 wks', ai: 'Manual vetting', guarantee: '60 days' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'CTO @ NimbusAI (YC S23)', quote: 'We went from 0 to our first two senior engineers in 18 days. The AI scorecards were sharper than our internal interviews.', rating: 5 },
  { name: 'Marcus Till', role: 'VP Engineering @ Flowstack', quote: 'The 90-day guarantee sealed the deal. First two hires are still with us 8 months later. Game-changer for early-stage teams.', rating: 5 },
  { name: 'Priya Nair', role: 'Founder @ PortalOS (Series A)', quote: 'Triplebite cut our cost-per-hire by 38% vs our previous agency. Candidates were actually excited about the interview process.', rating: 5 },
];

export default function LandingPage() {
  return (
    <div style={{ paddingTop: 68 }}>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem', textAlign: 'center' }}>
          <motion.div {...fadeUp(0)}>
            <span className="badge badge-violet" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              <Zap size={12} /> Series A & B Hiring — Reimagined
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} style={{ marginBottom: '1.5rem', maxWidth: 900, margin: '0 auto 1.5rem' }}>
            Hire Senior Engineers{' '}
            <span className="gradient-text">3× Faster</span>
            {' '}with AI Interviews
          </motion.h1>

          <motion.p {...fadeUp(0.2)} style={{ fontSize: '1.2rem', maxWidth: 620, margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
            Triplebite's AI conducts rigorous technical interviews, ranks candidates, and delivers your shortlist in 21 days — backed by a 90-day placement guarantee.
          </motion.p>

          <motion.div {...fadeUp(0.3)} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="btn btn-primary btn-lg">
              Start hiring now <ArrowRight size={18} />
            </Link>
            <Link to="/auth" className="btn btn-secondary btn-lg">
              I'm a candidate
            </Link>
          </motion.div>

          {/* Social proof strip */}
          <motion.div {...fadeUp(0.4)} style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {['Backed by YC alumni', '500+ vetted engineers', '0 failed placements (beta)'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <CheckCircle size={14} color="var(--emerald)" /> {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <motion.div key={s.value} {...fadeUp(i * 0.1)}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', background: 'linear-gradient(135deg, var(--violet-light), var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {s.value}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.25rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="section-label">Platform Features</p>
            <h2>Everything your team needs to<br /><span className="gradient-text">hire with confidence</span></h2>
            <p style={{ marginTop: '1rem', maxWidth: 540, margin: '1rem auto 0' }}>From AI-powered assessments to ATS integrations — one platform, full-funnel.</p>
          </motion.div>
          <div className="grid-3">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.08)} className="card">
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `rgba(${f.color === 'var(--violet-light)' ? '139,92,246' : f.color === 'var(--cyan)' ? '6,182,212' : f.color === 'var(--emerald-light)' ? '52,211,153' : '245,158,11'}, 0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="section-label">How It Works</p>
            <h2>From job post to shortlist<br /><span className="gradient-text">in 21 days</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Post the Role', desc: 'Define requirements, seniority, and skills in a 5-min setup flow.' },
              { step: '02', title: 'AI Screens Candidates', desc: 'Our engine sends adaptive assessments to matched candidates from our vetted pool.' },
              { step: '03', title: 'Review Shortlist', desc: 'Receive ranked top 3–5 candidates with AI-generated summaries and scorecards.' },
              { step: '04', title: 'Hire & Guarantee', desc: 'Make the hire. Backed by a 90-day replacement guarantee if it doesn\'t work out.' },
            ].map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.1)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--violet-glow)', opacity: 0.4 }}>{s.step}</div>
                <div style={{ height: 2, width: 40, background: 'linear-gradient(90deg, var(--violet), var(--cyan))' }} />
                <h3 style={{ fontSize: '1.05rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Competitive Comparison</p>
            <h2>We stack up <span className="gradient-text">differently</span></h2>
          </motion.div>
          <motion.div {...fadeUp(0.15)} style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {['Platform', 'Pricing', 'Speed', 'AI Engine', 'Guarantee'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitors.map(c => (
                  <tr key={c.name} style={{
                    background: c.highlight ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                    border: c.highlight ? '1px solid rgba(124,58,237,0.4)' : '1px solid var(--border)',
                    borderRadius: 12,
                  }}>
                    {[c.name, c.price, c.speed, c.ai, c.guarantee].map((val, vi) => (
                      <td key={vi} style={{ padding: '1rem 1rem', fontSize: '0.9rem', color: vi === 0 && c.highlight ? 'var(--violet-light)' : 'var(--text-secondary)', fontWeight: vi === 0 ? 600 : 400 }}>
                        {val}
                        {vi === 0 && c.highlight && <span className="badge badge-violet" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>YOU</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Testimonials</p>
            <h2>Loved by engineering <span className="gradient-text">leaders</span></h2>
          </motion.div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.1)} className="card">
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} color="var(--amber)" fill="var(--amber)" />)}
                </div>
                <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>"{t.quote}"</p>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: '5rem' }}>
        <div className="container">
          <motion.div {...fadeUp()} style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
            border: '1px solid rgba(124,58,237,0.3)',
            boxShadow: '0 0 60px rgba(124,58,237,0.15)',
          }}>
            <p className="section-label">Ready to hire smarter?</p>
            <h2 style={{ marginBottom: '1rem' }}>Your next senior engineer<br /><span className="gradient-text">is 21 days away</span></h2>
            <p style={{ marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
              Join 50+ Series A & B startups that have closed senior engineering roles through Triplebite.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth" className="btn btn-primary btn-lg">
                Start for free <ArrowRight size={18} />
              </Link>
              <Link to="/pricing" className="btn btn-secondary btn-lg">
                View pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Zap size={14} color="var(--violet-light)" />
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>Triplebite</span>
          </div>
          <p>© 2026 Triplebite Inc. · AI-Driven Technical Hiring for Series A & B Startups</p>
        </div>
      </footer>
    </div>
  );
}
