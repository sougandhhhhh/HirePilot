// HirePilot AI – Premium AI Career Advisor
import { useState } from 'react';
import { SectionHeader, ProgressBar, Pill, Loading, InfoBox, scoreColour } from '../components/UI';

const TABS = [
  { id: 'roadmap',   label: '🗺️ Career Roadmap' },
  { id: 'salary',    label: '💰 Salary Forecast' },
  { id: 'companies', label: '🏢 Top Companies' },
  { id: 'skills',    label: '🔮 Future Skills' },
  { id: 'certs',     label: '📜 Certifications' },
];

export default function Advisor() {
  const [role, setRole]           = useState('Full Stack Developer');
  const [exp, setExp]             = useState('3–5 years');
  const [skillsRaw, setSkillsRaw] = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [tab, setTab]             = useState('roadmap');

  async function getAdvice() {
    setLoading(true); setResult(null);
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const prompt = `You are a career advisor AI. Given a user's profile, return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "career_roadmap": [{"year": "Now", "title": "string", "focus": "string"}, {"year": "6 months", "title": "string", "focus": "string"}, {"year": "1 year", "title": "string", "focus": "string"}, {"year": "2 years", "title": "string", "focus": "string"}],
  "salary_prediction": {"current": "string", "12_months": "string", "24_months": "string", "36_months": "string"},
  "top_companies": [{"name": "string", "culture": "string", "match": number}],
  "future_skills": [{"skill": "string", "timeline": "string", "relevance": number}],
  "certifications": ["string"],
  "market_insight": "string"
}

User profile:
Role: ${role}
Experience: ${exp}
Skills: ${skills.join(', ') || 'Not specified'}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      let parsed;
      try {
        parsed = JSON.parse(data.response);
      } catch {
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      }
      if (parsed) {
        setResult({
          career_roadmap: Array.isArray(parsed.career_roadmap) ? parsed.career_roadmap : [],
          salary_prediction: parsed.salary_prediction || {},
          top_companies: Array.isArray(parsed.top_companies) ? parsed.top_companies : [],
          future_skills: Array.isArray(parsed.future_skills) ? parsed.future_skills : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
          market_insight: parsed.market_insight || '',
        });
        return;
      }
      throw new Error('Failed to parse AI response');
    } catch (err) {
      console.error('Career advice error:', err);
      setResult({
        career_roadmap: [{ year: 'Now', title: 'Error generating advice', focus: 'Please try again later.' }],
        salary_prediction: {},
        top_companies: [],
        future_skills: [],
        certifications: [],
        market_insight: 'Unable to generate career advice at this time.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SectionHeader icon="🚀" title="AI Career Advisor" />
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '.92rem', maxWidth: 560 }}>
        Get a personalized career roadmap, salary forecast, and AI-powered strategic insights.
      </p>

      {/* ── Config card ───────────────────────────── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="col-3">
          <div className="form-group">
            <label>🎯 Current Role</label>
            <input className="form-control" value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div className="form-group">
            <label>📅 Experience</label>
            <select className="form-control" value={exp} onChange={e => setExp(e.target.value)}>
              {['< 1 year', '1–2 years', '3–5 years', '5–8 years', '8+ years'].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>🛠️ Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
            <input className="form-control" value={skillsRaw} onChange={e => setSkillsRaw(e.target.value)} />
          </div>
        </div>
        <button
          className="btn"
          style={{ borderRadius: 12 }}
          onClick={getAdvice}
          disabled={loading}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
              Analyzing…
            </>
          ) : '🚀 Get Career Advice'}
        </button>
      </div>

      {loading && <Loading message="IBM watsonx AI is analysing your career trajectory…" />}
      {!result && !loading && (
        <InfoBox>ℹ️ Fill in your profile above and click Get Career Advice to receive a personalised career strategy.</InfoBox>
      )}

      {result && (
        <>
          {/* Tabs */}
          <div className="tabs-bar">
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Career Roadmap ─────────────────────── */}
          {tab === 'roadmap' && (
            <div className="card">
              {(result.career_roadmap || []).map((step, i) => {
                const isNow = step.year === 'Now';
                return (
                  <div key={i} style={{
                    display: 'flex', gap: '1.25rem', padding: '1rem 0',
                    borderBottom: i < result.career_roadmap.length - 1 ? '1px solid var(--glass-border)' : 'none',
                    animation: `slideUp .35s ease ${i * 80}ms both`,
                  }}>
                    <div style={{ minWidth: 80, textAlign: 'center' }}>
                      <div style={{
                        background: isNow ? 'var(--ibm-blue)' : 'rgba(255,255,255,0.06)',
                        color: isNow ? '#fff' : 'var(--text-muted)',
                        borderRadius: 10, padding: '.3rem .6rem',
                        fontSize: '.75rem', fontWeight: 600,
                        display: 'inline-block',
                      }}>{step.year}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '.95rem', color: isNow ? 'var(--electric)' : 'var(--text-primary)', marginBottom: '.25rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        {step.title}
                        {isNow && (
                          <span style={{
                            background: 'var(--ibm-blue)', color: '#fff',
                            fontSize: '.6rem', padding: '2px 7px', borderRadius: 8, fontWeight: 500,
                          }}>YOU ARE HERE</span>
                        )}
                      </div>
                      <div style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{step.focus}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Salary Forecast ─────────────────────── */}
          {tab === 'salary' && (() => {
            const s = result.salary_prediction || {};
            const items = [
              ['Current', s.current, '#64748b'],
              ['12 Months', s['12_months'], '#fbbf24'],
              ['24 Months', s['24_months'], '#0F62FE'],
              ['36 Months', s['36_months'], '#34d399'],
            ];
            const vals = items.map(([, v]) => parseInt((v || '0').replace(/\D/g, '')) || 0);
            const maxV = Math.max(...vals) || 1;
            return (
              <>
                <div className="col-4" style={{ marginBottom: '1.5rem' }}>
                  {items.map(([label, amount, colour]) => (
                    <div key={label} className="metric-card" style={{ borderTop: `2px solid ${colour}`, textAlign: 'center' }}>
                      <div className="card-value" style={{ color: colour, fontSize: '1.4rem' }}>{amount}</div>
                      <div className="card-label">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <SectionHeader icon="📈" title="Salary Growth Trajectory" />
                  {items.map(([label,, colour], i) => (
                    <ProgressBar key={i} label={label} value={Math.round(vals[i] / maxV * 100)} colour={colour} />
                  ))}
                  {result.market_insight && (
                    <div className="info-box" style={{ marginTop: '1rem' }}>
                      📊 {result.market_insight}
                    </div>
                  )}
                </div>
              </>
            );
          })()}

          {/* ── Top Companies ────────────────────────── */}
          {tab === 'companies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {(result.top_companies || []).map((co, i) => {
                const c = scoreColour(co.match);
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem 1.2rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 14,
                    animation: `slideUp .35s ease ${i * 60}ms both`,
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.95rem', color: 'var(--text-primary)' }}>{co.name}</div>
                      <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{co.culture}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: c }}>{co.match}%</div>
                      <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>culture match</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Future Skills ─────────────────────────── */}
          {tab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
              {(result.future_skills || []).map((s, i) => {
                const c = scoreColour(s.relevance);
                return (
                  <div key={i} style={{
                    padding: '.9rem 1.1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 14,
                    animation: `slideUp .35s ease ${i * 60}ms both`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                      <strong style={{ fontSize: '.9rem', color: 'var(--text-primary)' }}>{s.skill}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                        <Pill text={s.timeline} style="blue" />
                        <span style={{ fontWeight: 700, color: c, fontSize: '.9rem' }}>{s.relevance}%</span>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 999, height: 5, overflow: 'hidden' }}>
                      <div style={{ width: `${s.relevance}%`, height: 5, background: `linear-gradient(90deg, ${c}80, ${c})`, borderRadius: 999 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Certifications ─────────────────────────── */}
          {tab === 'certs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {(result.certifications || []).map((cert, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '.9rem 1.1rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  borderLeft: '3px solid #0F62FE',
                  borderRadius: '0 14px 14px 0',
                  animation: `slideIn .35s ease ${i * 60}ms both`,
                }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(15,98,254,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    📜
                  </div>
                  <span style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{cert}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
