// HirePilot AI – Premium Dashboard
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader } from '../components/UI';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { href: '/resume',       label: 'Analyze Resume',   icon: '📄', accent: '#2563EB' },
  { href: '/jobs',         label: 'Match Jobs',        icon: '🔍', accent: '#0891B2' },
  { href: '/interview',    label: 'Practice Interview',icon: '🎤', accent: '#7C3AED' },
  { href: '/cover-letter', label: 'Cover Letter',      icon: '✉️', accent: '#059669' },
  { href: '/skills',       label: 'Skill Analysis',    icon: '🧩', accent: '#D97706' },
  { href: '/advisor',      label: 'Career Advisor',    icon: '🚀', accent: '#DC2626' },
  { href: '/tracker',     label: 'Track Applications',icon: '📋', accent: '#475569' },
  { href: '/assistant',    label: 'AI Assistant',      icon: '🤖', accent: '#2563EB' },
];

export default function Dashboard() {
  return (
    <Layout>
      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="hero-premium">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge">
            <span className="hero-dot" />
            AI-Powered Career Tools
          </div>

          <h1 className="hero-title">
            Your AI Career Intelligence Hub
          </h1>
          <p className="hero-subtitle">
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

      {/* ── Quick Actions ──────────────────────────────── */}
      <SectionHeader icon="🚀" title="Quick Actions" />
      <div className="quick-actions-grid">
        {QUICK_ACTIONS.map(({ href, label, icon, accent }) => (
          <Link key={href} href={href} className="quick-action-card"
            onMouseEnter={e => { e.currentTarget.style.borderTopColor = accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderTopColor = ''; }}
          >
            <div className="quick-action-icon" style={{
              background: accent + '15',
              color: accent,
            }}>
              {icon}
            </div>
            {label}
          </Link>
        ))}
      </div>

      {/* ── Info Notice ─────────────────────────────────── */}
      <div className="info-box" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginTop: '2rem' }}>
        <span style={{ fontSize: '1.1rem' }}>🤖</span>
        <span>
          Upload your resume and use the tools above to get personalized career insights.
        </span>
      </div>
    </Layout>
  );
}
