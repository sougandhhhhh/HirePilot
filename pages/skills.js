// HirePilot AI – Skill Gap Analysis page
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, ProgressBar, Pill, Loading, InfoBox, Roadmap, scoreColour } from '../components/UI';

const ROLES = [
  'Senior Software Engineer','Staff Engineer','Principal Engineer',
  'Data Scientist','ML Engineer','DevOps / Platform Engineer',
  'Cloud Architect','Cybersecurity Specialist','AI Research Scientist',
];
const SKILLS_LIST = [
  'Python','JavaScript','TypeScript','Java','Go','React','Vue','Node.js',
  'AWS','GCP','Docker','Kubernetes','Terraform','SQL','MongoDB','Machine Learning','CI/CD',
];
const TABS = [
  { id: 'overview',  label: '📊 Skills Overview' },
  { id: 'missing',   label: '❌ Missing Skills' },
  { id: 'certs',     label: '📜 Certifications' },
  { id: 'projects',  label: '🔨 Projects' },
  { id: 'roadmap',   label: '🗺️ Roadmap' },
];

export default function SkillGap() {
  const [role, setRole]         = useState('Senior Software Engineer');
  const [skills, setSkills]     = useState(['Python','React','Node.js','SQL']);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [tab, setTab]           = useState('overview');

  async function analyze() {
    setLoading(true); setResult(null);
    const r = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, skills }),
    });
    setResult(await r.json());
    setLoading(false);
  }

  function toggleSkill(s) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  const PRIO_ORDER = ['High','Medium','Low'];

  return (
    <Layout title="Skill Gap Analysis">
      <SectionHeader icon="🧩" title="Skill Gap Analysis" />
      <p style={{ color: '#6f6f6f', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Discover exactly which skills you need to reach your next role — with a personalised learning roadmap.
      </p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="col-2">
          <div className="form-group">
            <label>🎯 Target Role</label>
            <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>🛠️ Your Current Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', padding: '.4rem 0' }}>
              {SKILLS_LIST.map(s => (
                <span key={s} className={`pill pill-${skills.includes(s) ? 'blue' : 'gray'}`}
                  style={{ cursor: 'pointer' }} onClick={() => toggleSkill(s)}>{s}</span>
              ))}
            </div>
          </div>
        </div>
        <button className="btn" onClick={analyze} disabled={loading}>
          {loading ? '⏳ Analyzing…' : '🔍 Analyze Skill Gaps'}
        </button>
      </div>

      {loading && <Loading message="Mapping your skills against industry requirements…" />}

      {result && (
        <>
          {/* KPI row */}
          <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
            <div className="metric-card accent-blue"  style={{ textAlign: 'center' }}><span className="card-icon">🛠️</span><div className="card-value">{result.current_skills?.length}</div><div className="card-label">Current Skills</div></div>
            <div className="metric-card accent-red"   style={{ textAlign: 'center' }}><span className="card-icon">❌</span><div className="card-value">{result.missing_skills?.length}</div><div className="card-label">Missing Skills</div></div>
            <div className="metric-card accent-teal"  style={{ textAlign: 'center' }}><span className="card-icon">📜</span><div className="card-value">{result.certifications?.length}</div><div className="card-label">Certifications</div></div>
            <div className="metric-card accent-purple" style={{ textAlign: 'center' }}><span className="card-icon">⏱️</span><div className="card-value">{result.estimated_weeks}w</div><div className="card-label">Est. Learn Time</div></div>
          </div>

          {result.salary_uplift_pct > 0 && (
            <div className="success-box" style={{ marginBottom: '1rem' }}>
              💰 Completing this path could increase your salary by up to <strong>{result.salary_uplift_pct}%</strong>.
            </div>
          )}

          {/* Tabs */}
          <div className="tabs-bar">
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {tab === 'overview' && (result.current_skills || []).map(s => (
            <ProgressBar key={s.name} label={`${s.name} (${s.level})`} value={s.score} />
          ))}

          {tab === 'missing' && [...(result.missing_skills || [])].sort((a,b) =>
            PRIO_ORDER.indexOf(a.priority) - PRIO_ORDER.indexOf(b.priority)
          ).map((s, i) => {
            const c = scoreColour(s.demand);
            const ps = { High: 'red', Medium: 'yellow', Low: 'green' }[s.priority] || 'gray';
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: 4, marginBottom: '.5rem', background: '#fff' }}>
                <div><strong>{s.name}</strong> &nbsp;<Pill text={s.priority} style={ps} /></div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '.78rem', color: '#6f6f6f' }}>Market demand</div>
                  <div style={{ fontWeight: 700, color: c }}>{s.demand}%</div>
                </div>
              </div>
            );
          })}

          {tab === 'certs' && (
            <div className="col-2">
              {(result.certifications || []).map((cert, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderTop: '3px solid #0f62fe', borderRadius: 4, padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: '.3rem' }}>📜 {cert.name}</div>
                  <div style={{ fontSize: '.78rem', color: '#6f6f6f', marginBottom: '.75rem' }}>
                    {cert.provider} · {cert.duration}
                  </div>
                  <a href={cert.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🔗 Learn More</a>
                </div>
              ))}
            </div>
          )}

          {tab === 'projects' && (result.projects || []).map((p, i) => {
            const ds = { Easy: 'green', Medium: 'yellow', Hard: 'red' }[p.difficulty] || 'gray';
            return (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #0f62fe', borderRadius: '0 4px 4px 0', padding: '1rem 1.2rem', marginBottom: '.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{p.name}</strong>
                  <div><Pill text={p.difficulty} style={ds} /><Pill text={`⏱️ ${p.time}`} style="gray" /></div>
                </div>
              </div>
            );
          })}

          {tab === 'roadmap' && (
            <>
              <div className="info-box">🗺️ Estimated: <strong>{result.estimated_weeks} weeks</strong> · Salary increase: <strong>+{result.salary_uplift_pct}%</strong></div>
              <Roadmap steps={result.roadmap || []} />
            </>
          )}
        </>
      )}

      {!loading && !result && (
        <InfoBox>ℹ️ Configure your target role and current skills above, then click Analyze.</InfoBox>
      )}
    </Layout>
  );
}
