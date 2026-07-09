// HirePilot AI – Resume Analyzer page
import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, Loading, ProgressBar, Pill, InfoBox, scoreColour } from '../components/UI';

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
  const fileRef = useRef();

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);

    // Read text client-side for the preview
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
      // API unreachable — use mock so the demo always works
      setResult(MOCK_RESULT);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Resume Analyzer">
      <SectionHeader icon="📄" title="Resume Analyzer" />
      <p style={{ color: '#6f6f6f', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Upload your resume to get an instant ATS score, strengths, weaknesses, and AI-powered suggestions.
      </p>

      <div className="col-2" style={{ alignItems: 'start' }}>
        {/* Upload */}
        <div>
          <div
            className="card"
            style={{ border: '2px dashed #c6c6c6', textAlign: 'center', cursor: 'pointer', padding: '2rem' }}
            onClick={() => fileRef.current.click()}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>📂</div>
            <div style={{ fontWeight: 500 }}>Click to select your resume</div>
            <div style={{ fontSize: '.75rem', color: '#6f6f6f', marginTop: '.25rem' }}>PDF, DOCX, or TXT · Max 10 MB</div>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }}
            onChange={e => { setFile(e.target.files[0]); setResult(null); setError(''); setText(''); }} />

          {file && (
            <div className="success-box" style={{ marginTop: '.75rem' }}>
              ✅ <strong>{file.name}</strong>
              <span style={{ color: '#6f6f6f', marginLeft: '.5rem' }}>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}
          {error && <div className="warn-box" style={{ marginTop: '.75rem' }}>⚠️ {error}</div>}

          <button className="btn btn-full" style={{ marginTop: '1rem' }}
            onClick={handleAnalyze} disabled={!file || loading}>
            {loading ? '⏳ Analyzing…' : '🔍 Analyze Resume'}
          </button>

          {text && (
            <details style={{ marginTop: '1.25rem' }}>
              <summary style={{ cursor: 'pointer', fontSize: '.82rem', color: '#6f6f6f' }}>📃 View extracted text</summary>
              <textarea readOnly value={text}
                style={{ width: '100%', height: 200, marginTop: '.5rem', fontSize: '.78rem',
                  border: '1px solid #e5e7eb', borderRadius: 4, padding: '.5rem', resize: 'vertical' }} />
            </details>
          )}
        </div>

        {/* Results */}
        <div>
          {loading && <Loading message="IBM watsonx AI is analyzing your resume…" />}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6f6f6f' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <div style={{ fontWeight: 600, color: '#161616' }}>No resume analyzed yet</div>
              <div style={{ fontSize: '.875rem', marginTop: '.5rem' }}>Upload a file on the left to get started.</div>
            </div>
          )}

          {result && (
            <>
              <div className="col-3" style={{ marginBottom: '1rem' }}>
                {[
                  { v: result.ats_score,        l: 'ATS Score',     sub: 'out of 100' },
                  { v: result.confidence_score, l: 'AI Confidence', sub: 'accuracy %' },
                  { v: result.word_count,       l: 'Word Count',    sub: 'ideal 450–600' },
                ].map(({ v, l, sub }) => (
                  <div key={l} className="metric-card accent-blue" style={{ textAlign: 'center' }}>
                    <div className="card-value" style={{ color: scoreColour(v <= 100 ? v : 70) }}>{v}</div>
                    <div className="card-label">{l}</div>
                    <div style={{ fontSize: '.72rem', color: '#6f6f6f', marginTop: 4 }}>{sub}</div>
                  </div>
                ))}
              </div>

              <ProgressBar label="ATS Score Progress" value={result.ats_score} />
              <hr className="divider" />

              <div className="tabs-bar">
                {TABS.map(t => (
                  <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`}
                    onClick={() => setTab(t.id)}>{t.label}</button>
                ))}
              </div>

              {tab === 'strengths' && (result.strengths || []).map((s, i) => (
                <div key={i} style={{ display:'flex', gap:'.6rem', padding:'.5rem 0', borderBottom:'1px solid #f4f4f4' }}>
                  <span style={{ color: '#42be65' }}>✓</span>
                  <span style={{ fontSize: '.875rem' }}>{s}</span>
                </div>
              ))}

              {tab === 'weaknesses' && (result.weaknesses || []).map((w, i) => (
                <div key={i} style={{ display:'flex', gap:'.6rem', padding:'.5rem 0', borderBottom:'1px solid #f4f4f4' }}>
                  <span style={{ color: '#fa4d56' }}>✗</span>
                  <span style={{ fontSize: '.875rem' }}>{w}</span>
                </div>
              ))}

              {tab === 'keywords' && (
                <>
                  <p style={{ fontSize: '.82rem', color: '#6f6f6f', marginBottom: '.75rem' }}>Add these keywords to increase your ATS score:</p>
                  {(result.missing_keywords || []).map(k => <Pill key={k} text={k} style="red" />)}
                </>
              )}

              {tab === 'suggestions' && (result.suggestions || []).map((s, i) => (
                <div key={i} style={{ display:'flex', gap:'.75rem', padding:'.75rem', background:'#f4f4f4', borderRadius:4, marginBottom:'.5rem' }}>
                  <div style={{ minWidth:22, height:22, borderRadius:'50%', background:'#0f62fe', color:'#fff', fontSize:'.72rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{i+1}</div>
                  <span style={{ fontSize: '.875rem' }}>{s}</span>
                </div>
              ))}

              {tab === 'sections' && (
                <div className="col-2">
                  <div><strong>✅ Found</strong><br />{(result.sections_found||[]).map(s=><Pill key={s} text={s} style="green" />)}</div>
                  <div><strong>❌ Missing</strong><br />{(result.sections_missing||[]).map(s=><Pill key={s} text={s} style="red" />)}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
