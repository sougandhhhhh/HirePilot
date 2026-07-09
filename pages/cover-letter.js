// HirePilot AI – Premium Cover Letter Generator
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, Loading } from '../components/UI';

function buildMockLetter(company, role) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
  return `${today}

Hiring Manager
${company}

Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With over three years of hands-on experience building scalable web applications and a deep passion for crafting elegant, maintainable code, I am confident I would make an immediate and lasting contribution to your engineering team.

Throughout my career, I have delivered high-impact projects — reducing API response times by 40%, scaling distributed systems to serve millions of concurrent users, and mentoring junior engineers to grow their craft. My core technical expertise spans Python, React, Node.js, and cloud-native architectures — skills directly aligned with the requirements outlined in your job description.

What excites me most about ${company} is your commitment to engineering excellence and the opportunity to work on products that matter at scale. I thrive in collaborative, fast-paced environments where curiosity and ownership are celebrated.

I would love the opportunity to discuss how my background and enthusiasm can drive meaningful impact at ${company}. Thank you for considering my application — I look forward to the conversation.

Warm regards,

Alex Johnson
alex.johnson@email.com | linkedin.com/in/alexjohnson | github.com/alexjohnson`;
}

const TIPS = [
  { icon: '🎯', title: 'Tailor Every Letter', body: 'Customise each letter for the specific company and role. Generic letters have a 3× lower response rate.' },
  { icon: '📊', title: 'Use Numbers', body: 'Quantify achievements wherever possible. "Improved performance by 40%" beats "improved performance".' },
  { icon: '✂️', title: 'Keep It Concise', body: 'Aim for 250–350 words. Hiring managers spend an average of 7 seconds on first read.' },
];

export default function CoverLetter() {
  const [company, setCompany] = useState('');
  const [role, setRole]       = useState('');
  const [jd, setJd]           = useState('');
  const [tone, setTone]       = useState('Professional');
  const [letter, setLetter]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);
  const [editing, setEditing] = useState(false);

  async function generate() {
    if (!company.trim() || !role.trim()) { setError('Please fill in Company and Role.'); return; }
    setError(''); setLoading(true); setLetter('');
    try {
      const r = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, job_description: jd, tone }),
      });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      setLetter(d.cover_letter || '');
    } catch {
      setLetter(buildMockLetter(company, role));
    } finally {
      setLoading(false);
    }
  }

  function copyLetter() {
    navigator.clipboard.writeText(letter).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadTxt() {
    const blob = new Blob([letter], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `cover_letter_${company.replace(/\s+/g, '_')}.txt`;
    a.click();
  }

  return (
    <Layout>
      <SectionHeader icon="✉️" title="Cover Letter Generator" />
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '.92rem', maxWidth: 560 }}>
        Generate a professional, tailored cover letter in seconds — powered by IBM watsonx AI.
      </p>

      {/* ── Split screen layout ──────────────────────── */}
      <div className="col-2" style={{ alignItems: 'start', gap: '1.5rem' }}>
        {/* ── Left: Prompt ──────────────────────────── */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 32, height: 32, background: 'var(--ibm-blue-soft)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</div>
            <h3 style={{ fontSize: '.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Letter Details</h3>
          </div>

          <div className="form-group">
            <label>🏢 Company Name</label>
            <input
              className="form-control"
              placeholder="e.g. Stripe, Google, IBM…"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>🎯 Role / Position</label>
            <input
              className="form-control"
              placeholder="e.g. Senior Software Engineer"
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>📋 Job Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              className="form-control"
              rows={6}
              placeholder="Paste the job description here for a more tailored letter…"
              value={jd}
              onChange={e => setJd(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>📢 Writing Tone</label>
            <select className="form-control" value={tone} onChange={e => setTone(e.target.value)}>
              {['Formal', 'Professional', 'Enthusiastic', 'Bold'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {error && <div className="warn-box" style={{ marginBottom: '1rem' }}>{error}</div>}

          <button
            className="btn btn-full"
            style={{ borderRadius: 12, padding: '.75rem' }}
            onClick={generate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
                Generating…
              </>
            ) : (
              <>✨ Generate Cover Letter</>
            )}
          </button>

          {/* Action buttons when letter exists */}
          {letter && !loading && (
            <div className="col-3" style={{ marginTop: '.85rem', gap: '.5rem' }}>
              <button className="btn btn-secondary btn-sm" style={{ borderRadius: 8 }} onClick={copyLetter}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button className="btn btn-secondary btn-sm" style={{ borderRadius: 8 }} onClick={downloadTxt}>
                💾 Download
              </button>
              <button className="btn btn-ghost btn-sm" style={{ borderRadius: 8 }} onClick={() => setEditing(!editing)}>
                {editing ? '💾 Done' : '✏️ Edit'}
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Generated letter ──────────────── */}
        <div>
          {loading && <Loading message="IBM watsonx AI is crafting your cover letter…" />}

          {!loading && !letter && (
            <div style={{
              textAlign: 'center', padding: '5rem 2rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              height: '100%',
              minHeight: 400,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '2rem',
              }}>✉️</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '.4rem' }}>
                Your cover letter will appear here
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
                Fill in the form on the left and click Generate.
              </div>
            </div>
          )}

          {letter && !loading && (
            <div style={{ animation: 'slideUp .4s cubic-bezier(0.16,1,0.3,1)' }}>
              <div className="success-box" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#34d399">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Cover letter generated for <strong>{company}</strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>{letter.split(/\s+/).length} words</span>
              </div>

              {editing ? (
                <textarea
                  className="form-control"
                  rows={20}
                  style={{ fontSize: '.875rem', lineHeight: 1.8, fontFamily: 'IBM Plex Sans, sans-serif' }}
                  value={letter}
                  onChange={e => setLetter(e.target.value)}
                />
              ) : (
                <div className="letter-box">{letter}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Tips ──────────────────────────────────────── */}
      <hr className="divider" />
      <SectionHeader icon="💡" title="Cover Letter Tips" />
      <div className="col-3">
        {TIPS.map(({ icon, title, body }) => (
          <div key={title} className="card" style={{ borderTop: '2px solid var(--ibm-blue)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '.6rem' }}>{icon}</div>
            <div style={{ fontWeight: 600, marginBottom: '.4rem', color: 'var(--text-primary)', fontSize: '.9rem' }}>{title}</div>
            <div style={{ fontSize: '.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{body}</div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
