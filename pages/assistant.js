// HirePilot AI – Premium AI Assistant
import Layout from '../components/Layout';
import { SectionHeader, Pill } from '../components/UI';
import WatsonxAgent from '../components/WatsonxAgent';

const CAPABILITIES = [
  { text: '📄 Resume Analysis',    style: 'blue'   },
  { text: '🔍 Job Matching',        style: 'cyan'   },
  { text: '🎤 Interview Prep',      style: 'purple' },
  { text: '🧩 Skill Gap Advice',    style: 'teal'   },
  { text: '✉️ Cover Letter Help',   style: 'yellow' },
  { text: '🚀 Career Strategy',     style: 'red'    },
  { text: '💰 Salary Insights',     style: 'green'  },
  { text: '🏢 Company Research',    style: 'gray'   },
];

const PROMPTS = [
  '📄 Analyze my resume and give me an ATS score',
  '🔍 Find me senior engineer jobs in San Francisco',
  '🧩 What skills am I missing for a Staff Engineer role?',
  '🎤 Give me 5 hard system design interview questions',
  '✉️ Write a cover letter for a role at Stripe',
  '🚀 What will my salary be in 3 years?',
];

export default function Assistant() {
  return (
    <Layout>
      {/* ── Header ──────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SectionHeader icon="🤖" title="AI Assistant" />
        <p style={{ color: 'var(--text-muted)', fontSize: '.92rem', maxWidth: 560 }}>
          Chat with your AI career agent — ask about your resume,
          job matches, interview prep, or any career topic.
        </p>
      </div>

      {/* ── Capability pills ────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1.5rem' }}>
        {CAPABILITIES.map(({ text, style }) => (
          <Pill key={text} text={text} style={style} />
        ))}
      </div>

      {/* ── Embedded agent ──────────────────────────── */}
      <div style={{
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(15,98,254,0.15)',
        position: 'relative',
      }}>
        {/* Header bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15,98,254,0.15) 0%, rgba(34,211,238,0.1) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '.85rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '.85rem',
        }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--ibm-blue), var(--cyan-dim))',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: '0 0 12px rgba(15,98,254,0.4)',
          }}>✈</div>
          <div>
            <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              HirePilot AI Career Agent
            </div>
            <div style={{ fontSize: '.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', display: 'inline-block' }} />
              AI-Powered · Live
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '.4rem' }}>
            {['🔊', '📎'].map((icon, i) => (
              <button key={i} style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.85rem',
              }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Agent iframe */}
        <WatsonxAgent />
      </div>

      {/* ── Suggested prompts ────────────────────────── */}
      <div style={{ marginTop: '1.75rem' }}>
        <div style={{
          fontSize: '.72rem', fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '.8px', marginBottom: '.85rem',
          display: 'flex', alignItems: 'center', gap: '.5rem',
        }}>
          <span>✦</span> Suggested Prompts
        </div>
        <div className="col-3">
          {PROMPTS.map((p, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 14,
              padding: '.75rem 1rem',
              fontSize: '.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              cursor: 'pointer',
              transition: 'all .2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ibm-blue-soft)'; e.currentTarget.style.borderColor = 'rgba(15,98,254,0.3)'; e.currentTarget.style.color = 'var(--electric)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
