// HirePilot AI – Premium Dashboard
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Gauge, MetricCard, ProgressBar, SectionHeader, Loading, scoreColour } from '../components/UI';
import Link from 'next/link';

const FALLBACK = {
  career_readiness_score: 78, ats_score: 82, recommended_jobs: 14,
  interview_readiness: 71, skill_gap_score: 65, profile_strength: 88,
  recent_activity: [
    { action: 'Resume uploaded and analyzed',          time: '2 hours ago' },
    { action: 'Applied to Senior Developer at Stripe', time: '1 day ago' },
    { action: 'Interview scheduled with Cloudflare',   time: '2 days ago' },
    { action: 'Cover letter generated for Databricks', time: '3 days ago' },
  ],
};

// Animated floating particles
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    dx: (Math.random() - 0.5) * 80,
    dy: -(Math.random() * 100 + 40),
    color: ['#0F62FE', '#22d3ee', '#a78bfa', '#34d399'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: 0,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            animation: `particleDrift ${3 + Math.random() * 4}s ease-out ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

// AI Confidence ring
function AIConfidenceRing({ value = 91 }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="44" cy="44" r={r} fill="none"
          stroke="url(#confGrad)" strokeWidth="6"
          strokeDasharray={circ.toFixed(1)}
          strokeDashoffset={offset.toFixed(1)}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.6))' }}
        />
        <defs>
          <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F62FE" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <text x="44" y="40" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f0f6ff" fontFamily="IBM Plex Sans, sans-serif">{value}</text>
        <text x="44" y="54" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="IBM Plex Sans, sans-serif">AI CONF.</text>
      </svg>
    </div>
  );
}

const QUICK_ACTIONS = [
  { href: '/resume',       label: 'Analyze Resume',   icon: '◱', color: '#0F62FE', bg: 'rgba(15,98,254,0.15)' },
  { href: '/jobs',         label: 'Match Jobs',        icon: '◉', color: '#22d3ee', bg: 'rgba(34,211,238,0.12)' },
  { href: '/interview',    label: 'Practice Interview',icon: '◎', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { href: '/cover-letter', label: 'Cover Letter',      icon: '◧', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  { href: '/skills',       label: 'Skill Analysis',    icon: '◈', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { href: '/advisor',      label: 'Career Advisor',    icon: '◈', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
];

export default function Dashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => setData(d))
      .catch(() => setData(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* ── Hero Banner ─────────────────────────────────── */}
      <div style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: '2rem',
        padding: '2.5rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(15,98,254,0.2) 0%, rgba(139,92,246,0.15) 50%, rgba(34,211,238,0.1) 100%)',
        border: '1px solid rgba(15,98,254,0.2)',
      }}>
        <Particles />
        {/* Gradient mesh */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 80% at 20% 50%, rgba(15,98,254,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.5rem',
            background: 'rgba(15,98,254,0.15)',
            border: '1px solid rgba(15,98,254,0.3)',
            borderRadius: 999,
            padding: '.25rem .85rem',
            fontSize: '.72rem', fontWeight: 600, letterSpacing: '1px',
            textTransform: 'uppercase', color: '#60a5fa',
            marginBottom: '1rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee', display: 'inline-block' }} />
            Powered by IBM watsonx Orchestrate
          </div>

          <h1 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 700,
            letterSpacing: '-.5px',
            marginBottom: '.6rem',
            background: 'linear-gradient(135deg, #f0f6ff 0%, #93c5fd 60%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2,
          }}>
            Your AI Career Intelligence Hub
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'rgba(148,163,184,0.9)',
            maxWidth: 580, lineHeight: 1.7,
          }}>
            Analyze your resume, bridge skill gaps, ace interviews, and track applications —
            all powered by IBM Agentic AI in one intelligent platform.
          </p>

          <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/resume" className="btn" style={{ borderRadius: 12 }}>
              Analyze My Resume
            </Link>
            <Link href="/assistant" className="btn btn-ghost" style={{ borderRadius: 12 }}>
              Ask AI Advisor
            </Link>
          </div>
        </div>
      </div>

      {loading && <Loading message="Loading your career insights…" />}

      {data && (
        <>
          {/* ── KPI Bento Grid ──────────────────────────── */}
          <div style={{ marginBottom: '.5rem' }}>
            <SectionHeader icon="📊" title="Career Overview" />
          </div>

          <div className="bento-grid" style={{ marginBottom: '2rem' }}>
            {/* Career Readiness - large card */}
            <div className="bento-span-4 metric-card accent-blue" style={{
              background: 'linear-gradient(135deg, rgba(15,98,254,0.15) 0%, rgba(15,98,254,0.05) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
            }}>
              <div>
                <div className="card-icon">🎯</div>
                <div className="card-value">{data.career_readiness_score}%</div>
                <div className="card-label">Career Readiness</div>
                <div className="card-delta delta-up">↑ 5% this week</div>
              </div>
              <Gauge score={data.career_readiness_score} label="" size={90} />
            </div>

            {/* ATS Score */}
            <div className="bento-span-4 metric-card accent-green" style={{
              background: 'linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(52,211,153,0.04) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div className="card-icon">📄</div>
                <div className="card-value">{data.ats_score}</div>
                <div className="card-label">ATS Resume Score</div>
                <div className="card-delta delta-up">↑ 8 points</div>
              </div>
              <Gauge score={data.ats_score} label="" size={90} />
            </div>

            {/* AI Confidence */}
            <div className="bento-span-4 metric-card accent-cyan" style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0.04) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div className="card-icon">🤖</div>
                <div className="card-value">91%</div>
                <div className="card-label">AI Confidence</div>
                <div className="card-delta delta-up">High precision</div>
              </div>
              <AIConfidenceRing value={91} />
            </div>

            {/* Stats row */}
            <div className="bento-span-3 metric-card accent-teal">
              <div className="card-icon">💼</div>
              <div className="card-value">{data.recommended_jobs}</div>
              <div className="card-label">Matched Jobs</div>
              <div className="card-delta delta-up">+3 new today</div>
            </div>

            <div className="bento-span-3 metric-card accent-purple">
              <div className="card-icon">🗓️</div>
              <div className="card-value">3</div>
              <div className="card-label">Interviews Scheduled</div>
              <div className="card-delta delta-up">Next: Jan 20</div>
            </div>

            <div className="bento-span-3 metric-card accent-yellow">
              <div className="card-icon">🧩</div>
              <div className="card-value">{data.skill_gap_score}%</div>
              <div className="card-label">Skill Gap Score</div>
              <div className="card-delta delta-down">↓ 2% (improving!)</div>
            </div>

            <div className="bento-span-3 metric-card accent-blue">
              <div className="card-icon">📤</div>
              <div className="card-value">12</div>
              <div className="card-label">Applications Sent</div>
              <div className="card-delta delta-up">80% response rate</div>
            </div>
          </div>

          {/* ── Score Breakdown + Activity ──────────────── */}
          <div className="col-2" style={{ marginBottom: '2rem', alignItems: 'start' }}>
            {/* Left: Gauges + progress */}
            <div>
              <SectionHeader icon="📈" title="Score Breakdown" />
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <Gauge score={data.career_readiness_score} label="Career Readiness" />
                  <Gauge score={data.ats_score} label="ATS Score" />
                  <Gauge score={data.interview_readiness} label="Interview Ready" />
                  <Gauge score={data.skill_gap_score} label="Skill Fit" />
                </div>
              </div>

              <SectionHeader icon="💪" title="Profile Strength" />
              <div className="card">
                <ProgressBar label="Profile Completeness" value={data.profile_strength || 88} />
                <ProgressBar label="Resume Quality"       value={data.ats_score} />
                <ProgressBar label="Interview Readiness"  value={data.interview_readiness} />
                <ProgressBar label="Skill Fit Score"      value={data.skill_gap_score} />
              </div>
            </div>

            {/* Right: Activity + Quick Actions */}
            <div>
              <SectionHeader icon="⚡" title="Recent Activity" />
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                {(data.recent_activity || []).map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '.85rem', padding: '.75rem 0',
                    borderBottom: i < data.recent_activity.length - 1 ? '1px solid var(--glass-border)' : 'none',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 32, height: 32, flexShrink: 0,
                      background: 'var(--ibm-blue-soft)',
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.7rem', marginTop: 2,
                    }}>
                      {['📄', '💼', '🗓️', '✉️'][i] || '⚡'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '.865rem', color: 'var(--text-secondary)' }}>{a.action}</div>
                      <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <SectionHeader icon="🚀" title="Quick Actions" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
                {QUICK_ACTIONS.map(({ href, label, icon, color, bg }) => (
                  <Link key={href} href={href} style={{
                    display: 'flex', alignItems: 'center', gap: '.65rem',
                    padding: '.8rem 1rem',
                    background: bg,
                    border: `1px solid ${color}30`,
                    borderRadius: 14,
                    textDecoration: 'none',
                    transition: 'all .2s cubic-bezier(0.16,1,0.3,1)',
                    color: color,
                    fontSize: '.82rem', fontWeight: 500,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${color}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── IBM watsonx notice ──────────────────────── */}
          <div className="info-box" style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🤖</span>
            <span>
              All AI insights powered by <strong>IBM watsonx Orchestrate</strong>.
              Connect your API key in environment settings to activate live agents.
            </span>
          </div>
        </>
      )}
    </Layout>
  );
}
