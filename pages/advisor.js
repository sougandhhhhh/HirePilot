// HirePilot AI – AI Career Advisor page
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, ProgressBar, Pill, Loading, Roadmap, InfoBox, scoreColour } from '../components/UI';

const TABS = [
  { id: 'roadmap',    label: '🗺️ Career Roadmap' },
  { id: 'salary',     label: '💰 Salary Forecast' },
  { id: 'companies',  label: '🏢 Top Companies' },
  { id: 'skills',     label: '🔮 Future Skills' },
  { id: 'certs',      label: '📜 Certifications' },
];

export default function Advisor() {
  const [role, setRole]       = useState('Full Stack Developer');
  const [exp, setExp]         = useState('3–5 years');
  const [skillsRaw, setSkillsRaw] = useState('Python, React, Node.js, SQL');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab]         = useState('roadmap');

  async function getAdvice() {
    setLoading(true); setResult(null);
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const r = await fetch('/api/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, experience: exp, skills }),
    });
    setResult(await r.json());
    setLoading(false);
  }

  return (
    <Layout title="AI Career Advisor">
      <SectionHeader icon="🚀" title="AI Career Advisor" />
      <p style={{ color: '#6f6f6f', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Get a personalised career roadmap, salary forecast, and IBM watsonx-powered strategic insights.
      </p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="col-3">
          <div className="form-group">
            <label>🎯 Current Role</label>
            <input className="form-control" value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div className="form-group">
            <label>📅 Experience</label>
            <select className="form-control" value={exp} onChange={e => setExp(e.target.value)}>
              {['< 1 year','1–2 years','3–5 years','5–8 years','8+ years'].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>🛠️ Skills (comma-separated)</label>
            <input className="form-control" value={skillsRaw} onChange={e => setSkillsRaw(e.target.value)} />
          </div>
        </div>
        <button className="btn" onClick={getAdvice} disabled={loading}>
          {loading ? '⏳ Analyzing…' : '🚀 Get Career Advice'}
        </button>
      </div>

      {loading && <Loading message="IBM watsonx AI is analysing your career trajectory…" />}

      {!result && !loading && (
        <InfoBox>ℹ️ Fill in your profile above and click 'Get Career Advice' to receive a personalised career strategy.</InfoBox>
      )}

      {result && (
        <>
          <div className="tabs-bar">
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {/* ── Career Roadmap ── */}
          {tab === 'roadmap' && (result.career_roadmap || []).map((step, i) => {
            const isNow = step.year === 'Now';
            return (
              <div key={i} style={{ display:'flex', gap:'1.25rem', padding:'1rem 0', borderBottom:'1px solid #f4f4f4' }}>
                <div style={{ minWidth:70, textAlign:'center' }}>
                  <div style={{ background: isNow ? '#0f62fe' : '#e5e7eb', color: isNow ? '#fff' : '#6f6f6f', borderRadius:4, padding:'.2rem .5rem', fontSize:'.75rem', fontWeight:600 }}>{step.year}</div>
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:'.95rem', color: isNow ? '#0f62fe' : '#161616', marginBottom:'.2rem' }}>
                    {step.title}
                    {isNow && <span style={{ background:'#0f62fe', color:'#fff', fontSize:'.62rem', padding:'2px 6px', borderRadius:8, marginLeft:8, fontWeight:500 }}>YOU ARE HERE</span>}
                  </div>
                  <div style={{ fontSize:'.82rem', color:'#6f6f6f' }}>{step.focus}</div>
                </div>
              </div>
            );
          })}

          {/* ── Salary Forecast ── */}
          {tab === 'salary' && (() => {
            const s = result.salary_prediction || {};
            const items = [
              ['Current',   s.current,   '#6f6f6f'],
              ['12 Months', s['12_months'], '#f1c21b'],
              ['24 Months', s['24_months'], '#0f62fe'],
              ['36 Months', s['36_months'], '#42be65'],
            ];
            const vals = items.map(([,v]) => parseInt((v||'0').replace(/\D/g,'')) || 0);
            const maxV = Math.max(...vals) || 1;
            return (
              <>
                <div className="col-4" style={{ marginBottom:'1.5rem' }}>
                  {items.map(([label, amount, colour]) => (
                    <div key={label} className="metric-card" style={{ borderTopColor: colour, textAlign:'center' }}>
                      <div className="card-value" style={{ color: colour, fontSize:'1.4rem' }}>{amount}</div>
                      <div className="card-label">{label}</div>
                    </div>
                  ))}
                </div>
                <SectionHeader icon="📈" title="Salary Growth Trajectory" />
                {items.map(([label, amount, colour], i) => (
                  <ProgressBar key={i} label={label} value={Math.round(vals[i]/maxV*100)} colour={colour} />
                ))}
                {result.market_insight && <div className="info-box" style={{ marginTop:'1rem' }}>📊 {result.market_insight}</div>}
              </>
            );
          })()}

          {/* ── Top Companies ── */}
          {tab === 'companies' && (result.top_companies || []).map((co, i) => {
            const c = scoreColour(co.match);
            return (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.2rem', border:'1px solid #e5e7eb', borderRadius:4, marginBottom:'.75rem', background:'#fff' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:'.95rem' }}>{co.name}</div>
                  <div style={{ fontSize:'.78rem', color:'#6f6f6f' }}>{co.culture}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'1.5rem', fontWeight:700, color:c }}>{co.match}%</div>
                  <div style={{ fontSize:'.7rem', color:'#6f6f6f' }}>culture match</div>
                </div>
              </div>
            );
          })}

          {/* ── Future Skills ── */}
          {tab === 'skills' && (result.future_skills || []).map((s, i) => {
            const c = scoreColour(s.relevance);
            return (
              <div key={i} style={{ padding:'.85rem 1rem', border:'1px solid #e5e7eb', borderRadius:4, marginBottom:'.5rem', background:'#fff' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.4rem' }}>
                  <strong style={{ fontSize:'.9rem' }}>{s.skill}</strong>
                  <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                    <Pill text={s.timeline} style="blue" />
                    <span style={{ fontWeight:700, color:c }}>{s.relevance}%</span>
                  </div>
                </div>
                <div style={{ background:'#e5e7eb', borderRadius:2, height:6, overflow:'hidden' }}>
                  <div style={{ width:`${s.relevance}%`, height:6, background:c, borderRadius:2 }} />
                </div>
              </div>
            );
          })}

          {/* ── Certifications ── */}
          {tab === 'certs' && (result.certifications || []).map((cert, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.85rem 1rem', border:'1px solid #e5e7eb', borderLeft:'4px solid #0f62fe', borderRadius:'0 4px 4px 0', marginBottom:'.5rem', background:'#fff' }}>
              <span style={{ fontSize:'1.2rem' }}>📜</span>
              <span style={{ fontSize:'.9rem', fontWeight:500 }}>{cert}</span>
            </div>
          ))}
        </>
      )}
    </Layout>
  );
}
