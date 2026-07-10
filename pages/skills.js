// HirePilot AI – Premium Skill Gap Analysis
import { useState } from 'react';
import { SectionHeader, ProgressBar, Pill, Loading, InfoBox, Roadmap, scoreColour } from '../components/UI';

const ROLES = [
  'Senior Software Engineer', 'Staff Engineer', 'Principal Engineer',
  'Data Scientist', 'ML Engineer', 'DevOps / Platform Engineer',
  'Cloud Architect', 'Cybersecurity Specialist', 'AI Research Scientist', 'Other',
];
const SKILLS_LIST = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'React', 'Vue', 'Node.js',
  'AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'SQL', 'MongoDB', 'Machine Learning', 'CI/CD',
];
const TABS = [
  { id: 'overview', label: '📊 Skills Overview' },
  { id: 'missing',  label: '❌ Missing Skills' },
  { id: 'certs',    label: '📜 Certifications' },
  { id: 'projects', label: '🔨 Projects' },
  { id: 'roadmap',  label: '🗺️ Roadmap' },
];
const PRIO_ORDER = ['High', 'Medium', 'Low'];

export default function SkillGap() {
  const [role, setRole]         = useState('Senior Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [skills, setSkills]     = useState([]);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [tab, setTab]           = useState('overview');

  const effectiveRole = role === 'Other' ? customRole : role;

  async function analyze() {
    setLoading(true); setResult(null);
    const prompt = `You are a skill gap analyst. Given a target role and current skills, generate a detailed analysis tailored specifically to this profile. Do NOT use generic or templated recommendations — be specific to the role and listed skills. Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "missing_skills": [{"name": "string", "priority": "High|Medium|Low", "demand": number (0-100)}],
  "certifications": [{"name": "string", "provider": "string", "duration": "string", "url": "string"}],
  "projects": [{"name": "string", "difficulty": "Easy|Medium|Hard", "time": "string"}],
  "roadmap": [{"title": "string", "description": "string", "weeks": number}],
  "estimated_weeks": number,
  "salary_uplift_pct": number
}
Return at least 4 missing skills, 3 certifications, 3 projects, and 4 roadmap steps.

Target role: ${effectiveRole}
Current skills: ${skills.join(', ') || 'None specified'}`;

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
      if (parsed && Array.isArray(parsed.missing_skills)) {
        setResult({
          current_skills: skills.map(s => ({ name: s, level: 'Intermediate', score: 70 })),
          missing_skills: parsed.missing_skills || [],
          certifications: parsed.certifications || [],
          projects: parsed.projects || [],
          roadmap: parsed.roadmap || [],
          estimated_weeks: parsed.estimated_weeks || 0,
          salary_uplift_pct: parsed.salary_uplift_pct || 0,
        });
        return;
      }
      throw new Error('Failed to parse AI response');
    } catch (err) {
      console.error('Skill gap error:', err);
      setResult({
        current_skills: skills.map(s => ({ name: s, level: 'Intermediate', score: 70 })),
        missing_skills: [],
        certifications: [],
        projects: [],
        roadmap: [],
        estimated_weeks: 0,
        salary_uplift_pct: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  const toggleSkill = s => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <>
      <SectionHeader icon="🧩" title="Skill Gap Analysis" />
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '.92rem', maxWidth: 560 }}>
        Discover exactly which skills you need for your next role — with a personalized learning roadmap.
      </p>

      {/* ── Config ──────────────────────────────────── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="col-2">
          <div className="form-group">
            <label>🎯 Target Role</label>
            <select className="form-control" value={role} onChange={e => { setRole(e.target.value); setCustomRole(''); }}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
            {role === 'Other' && (
              <input className="form-control" style={{ marginTop: '.5rem' }} placeholder="Enter target role..." value={customRole} onChange={e => setCustomRole(e.target.value)} />
            )}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>🛠️ Your Current Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(click to toggle)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', padding: '.4rem 0' }}>
              {SKILLS_LIST.map(s => (
                <span
                  key={s}
                  className={`pill pill-${skills.includes(s) ? 'blue' : 'gray'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleSkill(s)}
                >{s}</span>
              ))}
            </div>
          </div>
        </div>
        <button
          className="btn"
          style={{ borderRadius: 12, marginTop: '1rem' }}
          onClick={analyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
              Analyzing…
            </>
          ) : '🔍 Analyze Skill Gaps'}
        </button>
      </div>

      {loading && <Loading message="HirePilot AI is analyzing your skills…" />}

      {result && (
        <>
          {/* Stats */}
          <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
            <div className="metric-card accent-blue"   style={{ textAlign: 'center' }}><span className="card-icon">🛠️</span><div className="card-value">{result.current_skills?.length}</div><div className="card-label">Current Skills</div></div>
            <div className="metric-card accent-red"    style={{ textAlign: 'center' }}><span className="card-icon">❌</span><div className="card-value">{result.missing_skills?.length}</div><div className="card-label">Missing Skills</div></div>
            <div className="metric-card accent-teal"   style={{ textAlign: 'center' }}><span className="card-icon">📜</span><div className="card-value">{result.certifications?.length}</div><div className="card-label">Certifications</div></div>
            <div className="metric-card accent-purple" style={{ textAlign: 'center' }}><span className="card-icon">⏱️</span><div className="card-value">{result.estimated_weeks}w</div><div className="card-label">Est. Learn Time</div></div>
          </div>

          {result.salary_uplift_pct > 0 && (
            <div className="success-box" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <span>💰</span>
              Completing this learning path could increase your salary by up to <strong>{result.salary_uplift_pct}%</strong>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs-bar">
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview – current skills progress */}
          {tab === 'overview' && (
            <div className="card">
              {(result.current_skills || []).map((s, i) => (
                <ProgressBar key={s.name} label={`${s.name} (${s.level})`} value={s.score} />
              ))}
            </div>
          )}

          {/* Missing skills */}
          {tab === 'missing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {[...(result.missing_skills || [])].sort((a, b) => PRIO_ORDER.indexOf(a.priority) - PRIO_ORDER.indexOf(b.priority)).map((s, i) => {
                const c = scoreColour(s.demand);
                const ps = { High: 'red', Medium: 'yellow', Low: 'green' }[s.priority] || 'gray';
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '.85rem 1.1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 14,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{s.name}</strong>
                      <Pill text={s.priority} style={ps} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Market demand</div>
                      <div style={{ fontWeight: 700, color: c, fontSize: '.9rem' }}>{s.demand}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Certifications */}
          {tab === 'certs' && (
            <div className="col-2">
              {(result.certifications || []).map((cert, i) => (
                <div key={i} className="card" style={{ borderTop: '2px solid var(--ibm-blue)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '.35rem', color: 'var(--text-primary)', fontSize: '.9rem' }}>
                    📜 {cert.name}
                  </div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: '.85rem' }}>
                    {cert.provider} · {cert.duration}
                  </div>
                  <a href={cert.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ borderRadius: 8 }}>
                    Learn More
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {tab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
              {(result.projects || []).map((p, i) => {
                const ds = { Easy: 'green', Medium: 'yellow', Hard: 'red' }[p.difficulty] || 'gray';
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '.9rem 1.1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    borderLeft: '3px solid var(--ibm-blue)',
                    borderRadius: '0 14px 14px 0',
                  }}>
                    <strong style={{ color: 'var(--text-secondary)', fontSize: '.875rem' }}>{p.name}</strong>
                    <div style={{ display: 'flex', gap: '.4rem', flexShrink: 0, marginLeft: '1rem' }}>
                      <Pill text={p.difficulty} style={ds} />
                      <Pill text={`⏱️ ${p.time}`} style="gray" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Roadmap */}
          {tab === 'roadmap' && (
            <>
              <div className="info-box">
                🗺️ Estimated: <strong>{result.estimated_weeks} weeks</strong> &nbsp;·&nbsp;
                Salary increase: <strong>+{result.salary_uplift_pct}%</strong>
              </div>
              <div className="card" style={{ marginTop: '1rem' }}>
                <Roadmap steps={result.roadmap || []} />
              </div>
            </>
          )}
        </>
      )}

      {!loading && !result && (
        <InfoBox>ℹ️ Configure your target role and current skills above, then click Analyze.</InfoBox>
      )}
    </>
  );
}
