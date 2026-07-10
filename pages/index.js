// HirePilot AI – Premium Dashboard
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader } from '../components/UI';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { href: '/resume',       label: 'Analyze Resume',   icon: '📄', color: '#0F62FE', bg: 'rgba(15,98,254,0.15)' },
  { href: '/jobs',         label: 'Match Jobs',        icon: '🔍', color: '#22d3ee', bg: 'rgba(34,211,238,0.12)' },
  { href: '/interview',    label: 'Practice Interview',icon: '🎤', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { href: '/cover-letter', label: 'Cover Letter',      icon: '✉️', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  { href: '/skills',       label: 'Skill Analysis',    icon: '🧩', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { href: '/advisor',      label: 'Career Advisor',    icon: '🚀', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  { href: '/tracker',     label: 'Track Applications',icon: '📋', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
  { href: '/assistant',    label: 'AI Assistant',      icon: '🤖', color: '#0F62FE', bg: 'rgba(15,98,254,0.15)' },
];

export default function Dashboard() {
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
            AI-Powered Career Tools
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

      {/* ── Quick Actions ──────────────────────────────── */}
      <SectionHeader icon="🚀" title="Quick Actions" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '.75rem' }}>
        {QUICK_ACTIONS.map(({ href, label, icon, color, bg }) => (
          <Link key={href} href={href} style={{
            display: 'flex', alignItems: 'center', gap: '.75rem',
            padding: '1rem 1.25rem',
            background: bg,
            border: `1px solid ${color}30`,
            borderRadius: 16,
            textDecoration: 'none',
            transition: 'all .2s cubic-bezier(0.16,1,0.3,1)',
            color: color,
            fontSize: '.9rem', fontWeight: 500,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${color}25`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <span style={{ fontSize: '1.3rem' }}>{icon}</span>
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
