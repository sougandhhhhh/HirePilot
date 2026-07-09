// HirePilot AI – Job Matcher page
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, Pill, Loading, InfoBox, scoreColour } from '../components/UI';

const ROLES = [
  'Software Engineer','Full Stack Developer','Frontend Engineer','Backend Engineer',
  'Data Scientist','ML Engineer','DevOps Engineer','Cloud Architect',
  'Product Manager','Mobile Developer','Site Reliability Engineer',
];
const LOCATIONS = [
  'Remote','San Francisco, CA','New York, NY','Seattle, WA',
  'Austin, TX','Boston, MA','London, UK','Berlin, Germany',
];
const EXPERIENCE = [
  'Entry Level (0–2 years)','Mid Level (2–5 years)',
  'Senior Level (5–8 years)','Staff / Lead (8+ years)',
];
const SKILLS_LIST = [
  'Python','JavaScript','TypeScript','Java','Go','React','Vue','Node.js',
  'AWS','GCP','Azure','Kubernetes','Docker','Terraform','PostgreSQL','MongoDB',
  'Machine Learning','GraphQL','CI/CD','System Design',
];

export default function JobMatcher() {
  const [role, setRole]         = useState('Software Engineer');
  const [loc, setLoc]           = useState('Remote');
  const [exp, setExp]           = useState('Mid Level (2–5 years)');
  const [skills, setSkills]     = useState(['Python','React','Node.js']);
  const [minMatch, setMinMatch] = useState(75);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [added, setAdded]       = useState({});

  async function search() {
    setLoading(true); setResult(null);
    const r = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, location: loc, experience: exp, skills }),
    });
    setResult(await r.json());
    setLoading(false);
  }

  function toggleSkill(s) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function applyJob(job) {
    const key = `${job.company}_${job.title}`;
    if (!added[key]) {
      setAdded(prev => ({ ...prev, [key]: true }));
    }
  }

  const jobs = (result?.jobs || []).filter(j => j.match_pct >= minMatch);

  return (
    <Layout title="Job Matcher">
      <SectionHeader icon="🔍" title="Job Matcher" />
      <p style={{ color: '#6f6f6f', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Tell the AI your preferences and discover top-matched opportunities with salary insights.
      </p>

      {/* Search form */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="col-2">
          <div>
            <div className="form-group">
              <label>🎯 Target Role</label>
              <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>📍 Preferred Location</label>
              <select className="form-control" value={loc} onChange={e => setLoc(e.target.value)}>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="form-group">
              <label>📅 Experience Level</label>
              <select className="form-control" value={exp} onChange={e => setExp(e.target.value)}>
                {EXPERIENCE.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>🛠️ Skills (click to toggle)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', padding: '.5rem 0' }}>
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
        </div>
        <button className="btn" onClick={search} disabled={loading}>
          {loading ? '⏳ Searching…' : '🔍 Find Matching Jobs'}
        </button>
      </div>

      {loading && <Loading message="IBM watsonx is scanning thousands of job listings…" />}

      {result && (
        <>
          <div className="info-box">
            🎯 Found <strong>{result.total_found}</strong> matching jobs for
            <strong> {role}</strong> in <strong>{loc}</strong>. Showing top {jobs.length} results.
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '.82rem', fontWeight: 500 }}>Min match %:</label>
            <input type="range" min="0" max="100" value={minMatch}
              onChange={e => setMinMatch(+e.target.value)}
              style={{ width: 140 }} />
            <span style={{ fontWeight: 600, color: '#0f62fe' }}>{minMatch}%</span>
          </div>

          {jobs.map((job, i) => {
            const key = `${job.company}_${job.title}`;
            const c = scoreColour(job.match_pct);
            return (
              <div key={i} className="job-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4>{job.title}</h4>
                    <div className="job-meta">
                      🏢 {job.company} &nbsp;|&nbsp; 📍 {job.location}
                      &nbsp;|&nbsp; 💰 {job.salary} &nbsp;|&nbsp; 🕐 {job.posted}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 70 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: c }}>{job.match_pct}%</div>
                    <div style={{ fontSize: '.7rem', color: '#6f6f6f' }}>match</div>
                  </div>
                </div>
                <p style={{ fontSize: '.82rem', color: '#6f6f6f', margin: '0 0 .75rem' }}>{job.description}</p>
                <div style={{ height: 6, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden', marginBottom: '.75rem' }}>
                  <div style={{ height: 6, borderRadius: 2, background: c, width: `${job.match_pct}%` }} />
                </div>
                <div style={{ marginBottom: '.75rem' }}>
                  {(job.skills || []).map(s => <Pill key={s} text={s} style="blue" />)}
                </div>
                <div style={{ display: 'flex', gap: '.75rem' }}>
                  <button
                    className={`btn btn-sm${added[key] ? ' btn-secondary' : ''}`}
                    onClick={() => applyJob(job)}
                  >
                    {added[key] ? '✅ Added to Tracker' : '✅ Apply Now'}
                  </button>
                  <a href={job.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🔗 View Job</a>
                </div>
              </div>
            );
          })}
        </>
      )}

      {!loading && !result && (
        <div className="info-box">
          ℹ️ Select your preferences above and click 'Find Matching Jobs' to discover AI-curated opportunities.
        </div>
      )}
    </Layout>
  );
}
