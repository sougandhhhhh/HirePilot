// HirePilot AI – Premium Job Matcher
import { useState } from 'react';
import { SectionHeader, Pill, Loading, scoreColour } from '../components/UI';

const ROLES = [
  'Software Engineer','Full Stack Developer','Frontend Engineer','Backend Engineer',
  'Data Scientist','ML Engineer','DevOps Engineer','Cloud Architect',
  'Product Manager','Mobile Developer','Site Reliability Engineer','Other',
];
const LOCATIONS = [
  'Remote','San Francisco, CA','New York, NY','Seattle, WA',
  'Austin, TX','Boston, MA','London, UK','Berlin, Germany','Other',
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

const COMPANY_LOGOS = {
  Stripe: '💳', Cloudflare: '🌐', Databricks: '🔥', Figma: '🎨', Notion: '📝',
};

function MatchRing({ pct }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const c = scoreColour(pct);
  return (
    <div style={{ position: 'relative', width: 58, height: 58, flexShrink: 0 }}>
      <svg width="58" height="58" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx="29" cy="29" r={r} fill="none"
          stroke={c} strokeWidth="5"
          strokeDasharray={circ.toFixed(1)}
          strokeDashoffset={offset.toFixed(1)}
          strokeLinecap="round"
          transform="rotate(-90 29 29)"
          style={{ filter: `drop-shadow(0 0 4px ${c})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: '.82rem', fontWeight: 700, color: c, lineHeight: 1 }}>{pct}%</div>
        <div style={{ fontSize: '.55rem', color: 'var(--text-muted)' }}>match</div>
      </div>
    </div>
  );
}

export default function JobMatcher() {
  const [role, setRole]         = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [loc, setLoc]           = useState('Remote');
  const [customLoc, setCustomLoc] = useState('');
  const [exp, setExp]           = useState('Mid Level (2–5 years)');
  const [skills, setSkills]     = useState(['Python','React','Node.js']);
  const [minMatch, setMinMatch] = useState(75);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [added, setAdded]       = useState({});

  const effectiveRole = role === 'Other' ? customRole : role;
  const effectiveLoc = loc === 'Other' ? customLoc : loc;

  async function search() {
    setLoading(true); setResult(null);
    const prompt = `You are a job matching AI. Given a candidate profile, return 4-6 matching jobs with specific, realistic company names and role details. Be unique to this profile — do NOT reuse the same company descriptions across different inputs. Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "total_found": number,
  "jobs": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "salary": "string (include $ and K)",
      "description": "string (1 sentence)",
      "match_pct": number (0-100),
      "skills": ["string"],
      "posted": "string",
      "remote": boolean,
      "url": "string"
    }
  ]
}

Candidate profile:
Role: ${effectiveRole}
Experience: ${exp}
Location: ${effectiveLoc}
Skills: ${skills.join(', ')}`;

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
      if (parsed && Array.isArray(parsed.jobs)) {
        setResult({ total_found: parsed.total_found || parsed.jobs.length, jobs: parsed.jobs });
        return;
      }
      throw new Error('Failed to parse AI response');
    } catch (err) {
      console.error('Job search error:', err);
      setResult({ total_found: 0, jobs: [] });
    } finally {
      setLoading(false);
    }
  }

  const toggleSkill = s => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const jobs = (result?.jobs || []).filter(j => j.match_pct >= minMatch);

  return (
    <>
      <SectionHeader icon="🔍" title="Job Matcher" />
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '.92rem', maxWidth: 560 }}>
        Describe your ideal role and let AI surface the highest-match opportunities with salary insights.
      </p>

      {/* ── Filter Card ──────────────────────────────── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="col-2" style={{ marginBottom: '1rem' }}>
          <div>
            <div className="form-group">
              <label>🎯 Target Role</label>
              <select className="form-control" value={role} onChange={e => { setRole(e.target.value); setCustomRole(''); }}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
              {role === 'Other' && (
                <input className="form-control" style={{ marginTop: '.5rem' }} placeholder="Enter your role..." value={customRole} onChange={e => setCustomRole(e.target.value)} />
              )}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>📍 Preferred Location</label>
              <select className="form-control" value={loc} onChange={e => { setLoc(e.target.value); setCustomLoc(''); }}>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
              {loc === 'Other' && (
                <input className="form-control" style={{ marginTop: '.5rem' }} placeholder="Enter location..." value={customLoc} onChange={e => setCustomLoc(e.target.value)} />
              )}
            </div>
          </div>
          <div>
            <div className="form-group">
              <label>📅 Experience Level</label>
              <select className="form-control" value={exp} onChange={e => setExp(e.target.value)}>
                {EXPERIENCE.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>🛠️ Skills (click to toggle)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', padding: '.4rem 0' }}>
                {SKILLS_LIST.map(s => (
                  <span
                    key={s}
                    className={`pill pill-${skills.includes(s) ? 'blue' : 'gray'}`}
                    style={{ cursor: 'pointer', transition: 'all .15s' }}
                    onClick={() => toggleSkill(s)}
                  >{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button className="btn" onClick={search} disabled={loading} style={{ borderRadius: 12 }}>
          {loading ? (
            <>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
              Searching…
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Find Matching Jobs
            </>
          )}
        </button>
      </div>

      {loading && <Loading message="HirePilot AI is scanning job listings…" />}

      {result && (
        <>
          <div className="info-box" style={{ marginBottom: '1rem' }}>
            🎯 Found <strong>{result.total_found}</strong> jobs for <strong>{effectiveRole}</strong> in <strong>{effectiveLoc}</strong>.
            Showing <strong>{jobs.length}</strong> results.
          </div>

          {/* Match filter */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            margin: '0 0 1.5rem', flexWrap: 'wrap',
            padding: '.85rem 1.1rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--glass-border)',
            borderRadius: 12,
          }}>
            <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Min match:
            </label>
            <input
              type="range" min="0" max="100" value={minMatch}
              onChange={e => setMinMatch(+e.target.value)}
              style={{ flex: 1, maxWidth: 200, accentColor: 'var(--ibm-blue)' }}
            />
            <span style={{
              fontWeight: 700, color: scoreColour(minMatch),
              minWidth: 40, fontSize: '.9rem',
            }}>{minMatch}%</span>
          </div>

          {jobs.length === 0 && (
            <div className="info-box">No jobs match this filter. Try lowering the minimum match %.</div>
          )}

          {/* Job cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.map((job, i) => {
              const key = `${job.company}_${job.title}`;
              const c = scoreColour(job.match_pct);
              return (
                <div key={i} className="job-card" style={{ animationDelay: `${i * 60}ms` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.4rem' }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--glass-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.2rem', flexShrink: 0,
                        }}>
                          {COMPANY_LOGOS[job.company] || '🏢'}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{job.title}</h4>
                          <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>
                            {job.company} · {job.location}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '.82rem', color: 'var(--text-muted)', margin: '0 0 .85rem', lineHeight: 1.55 }}>
                        {job.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '.85rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '.75rem', color: 'var(--green)', fontWeight: 600 }}>
                          💰 {job.salary}
                        </span>
                        <span style={{ color: 'var(--glass-border)' }}>·</span>
                        <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>🕐 {job.posted}</span>
                        {job.remote && (
                          <span className="pill pill-cyan" style={{ fontSize: '.65rem' }}>Remote</span>
                        )}
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 999, height: 4, overflow: 'hidden', marginBottom: '.85rem' }}>
                        <div style={{ height: 4, borderRadius: 999, background: `linear-gradient(90deg, ${c}80, ${c})`, width: `${job.match_pct}%`, transition: 'width .8s ease' }} />
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginBottom: '.85rem' }}>
                        {(job.skills || []).map(s => <Pill key={s} text={s} style="blue" />)}
                      </div>

                      <div style={{ display: 'flex', gap: '.65rem' }}>
                        <button
                          className={`btn btn-sm${added[key] ? ' btn-success' : ''}`}
                          style={{ borderRadius: 8 }}
                          onClick={() => setAdded(p => ({ ...p, [key]: true }))}
                        >
                          {added[key] ? '✓ Added to Tracker' : 'Quick Apply'}
                        </button>
                        <a
                          href={job.url} target="_blank" rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ borderRadius: 8 }}
                        >
                          View Job
                        </a>
                        <button className="btn btn-ghost btn-sm" style={{ borderRadius: 8 }}>
                          Save
                        </button>
                      </div>
                    </div>

                    <MatchRing pct={job.match_pct} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && !result && (
        <div className="info-box">
          ℹ️ Configure your preferences above and click <strong>Find Matching Jobs</strong> to discover AI-curated opportunities.
        </div>
      )}
    </>
  );
}
