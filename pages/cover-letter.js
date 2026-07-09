// HirePilot AI – Cover Letter Generator page
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, Loading } from '../components/UI';

export default function CoverLetter() {
  const [company, setCompany]   = useState('');
  const [role, setRole]         = useState('');
  const [jd, setJd]             = useState('');
  const [tone, setTone]         = useState('Professional');
  const [letter, setLetter]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);
  const [editing, setEditing]   = useState(false);

  async function generate() {
    if (!company.trim() || !role.trim()) { setError('Please fill in Company and Role.'); return; }
    setError(''); setLoading(true); setLetter('');
    const r = await fetch('/api/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, role, job_description: jd, tone }),
    });
    const d = await r.json();
    setLetter(d.cover_letter || '');
    setLoading(false);
  }

  function copyLetter() {
    navigator.clipboard.writeText(letter).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadTxt() {
    const blob = new Blob([letter], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `cover_letter_${company.replace(/\s+/g,'_')}.txt`; a.click();
  }

  return (
    <Layout title="Cover Letter">
      <SectionHeader icon="✉️" title="Cover Letter Generator" />
      <p style={{ color: '#6f6f6f', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Generate a professional, tailored cover letter in seconds using IBM watsonx AI.
      </p>

      <div className="col-2" style={{ alignItems: 'start' }}>
        {/* Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 600 }}>✏️ Letter Details</h3>

          <div className="form-group">
            <label>🏢 Company Name</label>
            <input className="form-control" placeholder="e.g. Stripe, Google, IBM…"
              value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div className="form-group">
            <label>🎯 Role / Position</label>
            <input className="form-control" placeholder="e.g. Senior Software Engineer"
              value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div className="form-group">
            <label>📋 Job Description</label>
            <textarea className="form-control" rows={6} placeholder="Paste the job description here…"
              value={jd} onChange={e => setJd(e.target.value)} />
          </div>
          <div className="form-group">
            <label>📢 Tone</label>
            <select className="form-control" value={tone} onChange={e => setTone(e.target.value)}>
              {['Formal','Professional','Enthusiastic','Bold'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {error && <div className="warn-box">{error}</div>}

          <button className="btn btn-full" onClick={generate} disabled={loading}>
            {loading ? '⏳ Generating…' : '✨ Generate Cover Letter'}
          </button>
        </div>

        {/* Result */}
        <div>
          {loading && <Loading message="IBM watsonx AI is crafting your cover letter…" />}

          {!loading && !letter && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6f6f6f' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <div style={{ fontWeight: 600, color: '#161616' }}>Your cover letter will appear here</div>
              <div style={{ fontSize: '.875rem', marginTop: '.5rem' }}>Fill in the form on the left and click Generate.</div>
            </div>
          )}

          {letter && !loading && (
            <>
              <div className="success-box">
                ✅ Cover letter generated for <strong>{company}</strong>!
                &nbsp;·&nbsp; {letter.split(/\s+/).length} words
              </div>

              {editing ? (
                <textarea
                  className="form-control"
                  rows={18}
                  style={{ marginTop: '.75rem', fontSize: '.875rem', lineHeight: 1.8 }}
                  value={letter}
                  onChange={e => setLetter(e.target.value)}
                />
              ) : (
                <div className="letter-box" style={{ marginTop: '.75rem' }}>{letter}</div>
              )}

              {/* Action buttons */}
              <div className="col-3" style={{ marginTop: '1rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={copyLetter}>
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={downloadTxt}>
                  💾 Download TXT
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}>
                  {editing ? '💾 Done Editing' : '✏️ Edit Letter'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tips */}
      <hr className="divider" />
      <SectionHeader icon="💡" title="Cover Letter Tips" />
      <div className="col-3">
        {[
          ['🎯 Tailor Every Letter', 'Customise each letter for the specific company and role. Generic letters have a 3× lower response rate.'],
          ['📊 Use Numbers',         'Quantify achievements wherever possible. "Improved performance by 40%" beats "improved performance".'],
          ['✂️ Keep It Concise',    'Aim for 250–350 words. Hiring managers spend an average of 7 seconds on first read.'],
        ].map(([title, body]) => (
          <div key={title} className="card">
            <div style={{ fontWeight: 600, marginBottom: '.4rem' }}>{title}</div>
            <div style={{ fontSize: '.82rem', color: '#6f6f6f' }}>{body}</div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
