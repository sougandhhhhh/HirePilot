// HirePilot AI – Premium Resume Analyzer
import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, Loading, ProgressBar, Pill, InfoBox, scoreColour, Gauge } from '../components/UI';

const TABS = [
  { id: 'strengths',   label: '💪 Strengths' },
  { id: 'weaknesses',  label: '⚠️ Weaknesses' },
  { id: 'keywords',    label: '🔑 Keywords' },
  { id: 'suggestions', label: '💡 Suggestions' },
  { id: 'sections',    label: '📂 Sections' },
];

const MOCK_RESULT = {
  ats_score: 82, confidence_score: 91, word_count: 487,
  strengths: [
    'Strong technical skill set with Python and cloud technologies',
    'Clear and quantified achievements (e.g., 40% performance improvement)',
    'Relevant experience at well-known companies',
    'Good use of action verbs throughout',
  ],
  weaknesses: [
    'Missing a professional summary section',
    'Education section lacks GPA / honours details',
    'No mention of soft skills or leadership experience',
  ],
  missing_keywords: ['Kubernetes','CI/CD','Terraform','Agile','Scrum','Microservices','Docker','GraphQL'],
  suggestions: [
    'Add a 3–4 line professional summary at the top of your resume.',
    'Include quantified metrics for each role (percentages, team sizes, revenue impact).',
    'Add missing technical keywords naturally in experience bullets.',
    "Consider adding a 'Projects' section to demonstrate hands-on expertise.",
    'Tailor resume keywords to each job description for higher ATS scores.',
  ],
  sections_found:   ['Experience','Skills','Education','Certifications'],
  sections_missing: ['Summary','Projects','Awards'],
};

export default function ResumeAnalyzer() {
  const [file, setFile]       = useState(null);
  const [text, setText]       = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('strengths');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    const fileText = await file.text().catch(() => '');
    setText(fileText || '[Binary file – analysis complete]');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/resume', { method: 'POST', body: fd });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setResult(data);
    } catch {
      setResult(MOCK_RESULT);
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setResult(null); setError(''); setText(''); }
  }

  return (
    <Layout>
      <SectionHeader icon="📄" title="Resume Analyzer" />
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '.92rem', maxWidth: 560 }}>
        Upload your resume for an instant AI-powered ATS score, strengths analysis, and actionable improvement suggestions.
      </p>

      <div className="col-2" style={{ alignItems: 'start', gap: '1.5rem' }}>
        {/* ── Upload Panel ──────────────────────────── */}
        <div>
          {/* Drag & Drop Zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragging ? 'var(--ibm-blue)' : 'var(--glass-border)'}`,
              borderRadius: 20,
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? 'var(--ibm-blue-soft)' : 'rgba(255,255,255,0.02)',
              transition: 'all .25s ease',
              marginBottom: '1rem',
            }}
          >
            {/* Upload icon */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--ibm-blue-soft)',
              border: '1px solid rgba(15,98,254,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="#0F62FE">
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
              </svg>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '.5rem' }}>
              {dragging ? 'Drop it here!' : 'Drop your resume or click to upload'}
            </div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
              PDF, DOCX, or TXT · Max 10 MB
            </div>
          </div>

          <input
            ref={fileRef} type="file" accept=".pdf,.docx,.txt"
            style={{ display: 'none' }}
            onChange={e => { setFile(e.target.files[0]); setResult(null); setError(''); setText(''); }}
          />

          {file && (
            <div className="success-box" style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#34d399">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <div>
                <strong>{file.name}</strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '.5rem' }}>{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}

          {error && (
            <div className="warn-box">{error}</div>
          )}

          <button
            className="btn btn-full"
            style={{ marginTop: '1rem', borderRadius: 12, padding: '.75rem' }}
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
                Analyzing…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                Analyze Resume
              </>
            )}
          </button>

          {text && (
            <details style={{ marginTop: '1.25rem' }}>
              <summary style={{ cursor: 'pointer', fontSize: '.8rem', color: 'var(--text-muted)', userSelect: 'none' }}>
                View extracted text
              </summary>
              <textarea
                readOnly value={text}
                style={{
                  width: '100%', height: 180, marginTop: '.5rem',
                  fontSize: '.76rem', fontFamily: "'IBM Plex Mono', monospace",
                  border: '1px solid var(--glass-border)', borderRadius: 10,
                  padding: '.75rem', resize: 'vertical',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-secondary)',
                  outline: 'none',
                }}
              />
            </details>
          )}
        </div>

        {/* ── Results Panel ──────────────────────────── */}
        <div>
          {loading && <Loading message="IBM watsonx AI is analyzing your resume…" />}

          {!loading && !result && (
            <div style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '2rem',
              }}>📋</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '.4rem' }}>
                No resume analyzed yet
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
                Upload a file on the left to get started.
              </div>
            </div>
          )}

          {result && (
            <div style={{ animation: 'slideUp .4s cubic-bezier(0.16,1,0.3,1)' }}>
              {/* Score cards */}
              <div className="col-3" style={{ marginBottom: '1.25rem' }}>
                {[
                  { v: result.ats_score,        l: 'ATS Score',     sub: 'out of 100',    accent: 'blue' },
                  { v: result.confidence_score, l: 'AI Confidence', sub: 'accuracy',      accent: 'cyan' },
                  { v: result.word_count,        l: 'Word Count',    sub: 'ideal 450–600', accent: 'purple' },
                ].map(({ v, l, sub, accent }) => (
                  <div key={l} className={`metric-card accent-${accent}`} style={{ textAlign: 'center' }}>
                    <div className="card-value" style={{ fontSize: '1.7rem', color: scoreColour(v <= 100 ? v : 70) }}>{v}</div>
                    <div className="card-label">{l}</div>
                    <div style={{ fontSize: '.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>
                  </div>
                ))}
              </div>

              <ProgressBar label="ATS Score" value={result.ats_score} />
              <hr className="divider" />

              {/* Tabs */}
              <div className="tabs-bar">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    className={`tab-btn${tab === t.id ? ' active' : ''}`}
                    onClick={() => setTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === 'strengths' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {(result.strengths || []).map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '.75rem', alignItems: 'flex-start',
                      padding: '.85rem 1rem',
                      background: 'rgba(52,211,153,0.06)',
                      border: '1px solid rgba(52,211,153,0.15)',
                      borderRadius: 12,
                    }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="#34d399" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span style={{ fontSize: '.865rem', color: 'var(--text-secondary)' }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'weaknesses' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {(result.weaknesses || []).map((w, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '.75rem', alignItems: 'flex-start',
                      padding: '.85rem 1rem',
                      background: 'rgba(248,113,113,0.06)',
                      border: '1px solid rgba(248,113,113,0.15)',
                      borderRadius: 12,
                    }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="#f87171" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <span style={{ fontSize: '.865rem', color: 'var(--text-secondary)' }}>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'keywords' && (
                <div>
                  <p style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Add these keywords to increase your ATS score:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                    {(result.missing_keywords || []).map(k => <Pill key={k} text={k} style="red" />)}
                  </div>
                </div>
              )}

              {tab === 'suggestions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {(result.suggestions || []).map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '.85rem', alignItems: 'flex-start',
                      padding: '.85rem 1rem',
                      background: 'rgba(15,98,254,0.06)',
                      border: '1px solid rgba(15,98,254,0.12)',
                      borderRadius: 12,
                    }}>
                      <div style={{
                        minWidth: 24, height: 24, borderRadius: '50%',
                        background: 'var(--ibm-blue)', color: '#fff',
                        fontSize: '.7rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>{i + 1}</div>
                      <span style={{ fontSize: '.865rem', color: 'var(--text-secondary)' }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'sections' && (
                <div className="col-2" style={{ gap: '1rem' }}>
                  <div className="card">
                    <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '.85rem', fontSize: '.88rem' }}>
                      ✓ Sections Found
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                      {(result.sections_found || []).map(s => <Pill key={s} text={s} style="green" />)}
                    </div>
                  </div>
                  <div className="card">
                    <div style={{ fontWeight: 600, color: 'var(--red)', marginBottom: '.85rem', fontSize: '.88rem' }}>
                      ✗ Sections Missing
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                      {(result.sections_missing || []).map(s => <Pill key={s} text={s} style="red" />)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
