import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight, HelpCircle } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay }
});

const tiers = [
  {
    name: 'Startup',
    badge: null,
    fee: '20%',
    feeDesc: 'of first-year base salary',
    guarantee: '60-day replacement',
    ideal: 'Seed / early Series A',
    color: 'var(--cyan)',
    features: [
      'AI technical interview engine',
      'Curated candidate pool access',
      'Up to 5 candidates shortlisted',
      'Scorecards with AI summaries',
      'Email & chat support',
      '60-day placement guarantee',
    ],
    highlight: false,
  },
  {
    name: 'Growth',
    badge: 'Most Popular',
    fee: '25%',
    feeDesc: 'of first-year base salary',
    guarantee: '90-day replacement',
    ideal: 'Series A & B (10–100 employees)',
    color: 'var(--violet-light)',
    features: [
      'Everything in Startup',
      'Extended 90-day guarantee',
      'Priority candidate sourcing',
      'ATS integrations (Lever, Greenhouse)',
      'Dedicated account success manager',
      'Interview replay with timestamped highlights',
    ],
    highlight: true,
  },
  {
    name: 'Scale',
    badge: '5+ hires',
    fee: '22%',
    feeDesc: 'volume discount',
    guarantee: '90-day replacement',
    ideal: 'Series B scaling teams',
    color: 'var(--emerald-light)',
    features: [
      'Everything in Growth',
      'Volume discount at 5+ placements',
      'Custom assessment config per role',
      'Quarterly bias audit reports',
      'Slack connect with your team',
      'Referral credit program ($2K/referral)',
    ],
    highlight: false,
  },
];

const faqs = [
  { q: 'What does the 90-day guarantee actually mean?', a: 'If a placed candidate leaves or is let go within 90 days, we will find a replacement at zero additional placement fee. We share your hiring risk.' },
  { q: 'When do I pay?', a: 'Payment is success-based. You are invoiced only after a candidate accepts an offer and starts employment. No retainer, no upfront fee.' },
  { q: 'How does the AI interview work?', a: 'Candidates complete an async interview in their own time — typically 45–60 minutes. The AI adapts questions based on role and seniority, scores responses across four dimensions, and generates a narrative summary for your hiring team.' },
  { q: 'Can I use Triplebite with my existing ATS?', a: 'Yes. Growth and Scale tiers include native integrations with Lever, Greenhouse, and Ashby. API access is available for custom setups.' },
  { q: 'How are candidates sourced?', a: 'Our candidate pool of 500+ vetted senior engineers is built through YC alumni referrals, Wellfound partnership sourcing, and community partnerships. Every candidate has completed a pre-screening assessment before entering the pool.' },
];

export default function PricingPage() {
  return (
    <div style={{ paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 1rem', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 55%)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <motion.div {...fadeUp()}>
            <span className="badge badge-violet" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>Success-Based Pricing</span>
            <h1 style={{ marginBottom: '1rem' }}>Pay only when you <span className="gradient-text">hire</span></h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              No retainers. No upfront fees. A placement fee only after a candidate accepts and starts — backed by our guarantee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} {...fadeUp(i * 0.1)} style={{
                background: tier.highlight ? 'rgba(124,58,237,0.08)' : 'var(--bg-card)',
                border: `${tier.highlight ? 2 : 1}px solid ${tier.highlight ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                position: 'relative',
                boxShadow: tier.highlight ? 'var(--shadow-violet)' : 'var(--shadow-card)',
                transition: 'all 0.25s',
              }}>
                {tier.badge && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                    <span className="badge badge-violet" style={{ fontSize: '0.72rem' }}>
                      <Zap size={10} /> {tier.badge}
                    </span>
                  </div>
                )}
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: tier.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{tier.name}</p>
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'Space Grotesk', color: tier.color }}>{tier.fee}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{tier.feeDesc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <CheckCircle size={13} color="var(--emerald)" />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{tier.guarantee}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>Ideal for: {tier.ideal}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {tier.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={14} color="var(--emerald)" style={{ flexShrink: 0, marginTop: 2 }} /> {f}
                    </div>
                  ))}
                </div>
                <Link to="/auth" className={`btn ${tier.highlight ? 'btn-primary' : 'btn-secondary'} w-full`} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  Get started <ArrowRight size={15} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '3rem 1.5rem 6rem', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">FAQ</p>
            <h2>Common questions</h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <motion.div key={faq.q} {...fadeUp(i * 0.07)} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <HelpCircle size={16} color="var(--violet-light)" style={{ flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{faq.q}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
