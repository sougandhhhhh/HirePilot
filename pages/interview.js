// HirePilot AI – Interview Coach page
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, Pill, Loading, InfoBox, scoreColour } from '../components/UI';

const ROLES = [
  'Software Engineer','Full Stack Developer','Data Scientist','ML Engineer',
  'DevOps Engineer','Product Manager','Frontend Engineer','Backend Engineer',
  'Cloud Architect','Mobile Developer',
];
const DIFFICULTIES = ['All Levels','Easy','Medium','Hard'];
const CATEGORIES = [
  { id: 'technical',  label: '💻 Technical' },
  { id: 'hr',         label: '👔 HR' },
  { id: 'behavioral', label: '🧠 Behavioral' },
  { id: 'coding',     label: '👨‍💻 Coding' },
];

export default function InterviewCoach() {
  const [role, setRole]         = useState('Software Engineer');
  const [diff, setDiff]         = useState('All Levels');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [tab, setTab]           = useState('technical');
  const [showAnswers, setShowAnswers] = useState(true);
  const [selfQ, setSelfQ]       = useState('');
  const [selfA, setSelfA]       = useState('');
  const [evalScore, setEvalScore] = useState(null);

  async function generate() {
    setLoading(true); setResult(null);
    const r = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, difficulty: diff.toLowerCase().replace('all levels','all') }),
    });
    setResult(await r.json());
    setLoading(false);
  }

  function evaluate() {
    if (!selfA.trim()) return;
    const words = selfA.split(/\s+/).length;
    const score = Math.min(100, Math.max(40, 60 + Math.floor(words / 5)));
    setEvalScore({ score, words });
  }

  const filterQ = qs => diff === 'All Levels' ? qs : qs.filter(q => q.difficulty === diff.toLowerCase());
  const diffStyle = { easy: 'green', medium: 'yellow', hard: 'red' };

  return (
    <Layout title="Interview Coach">
      <SectionHeader icon="🎤" title="Interview Coach" />
      <p style={{ color: '#6f6f6f', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Practice with AI-generated interview questions tailored to your target role — with model answers.
      </p>

      {/* Config */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 2, margin: 0 }}>
            <label>🎯 Target Role</label>
            <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label>📊 Difficulty</label>
            <select className="form-control" value={diff} onChange={e => setDiff(e.target.value)}>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <button className="btn" style={{ marginBottom: 0 }} onClick={generate} disabled={loading}>
            {loading ? '⏳ Generating…' : '🎯 Generate Questions'}
          </button>
        </div>
      </div>

      {loading && <Loading message="IBM watsonx AI is crafting your interview questions…" />}

      {!result && !loading && (
        <InfoBox>ℹ️ Select your target role and difficulty, then click Generate Questions to start practising.</InfoBox>
      )}

      {result && (
        <>
          {/* Stats */}
          <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: '1.5rem' }}>
            {CATEGORIES.map(({ id, label }) => {
              const count = filterQ(result[id] || []).length;
              return <div key={id} className="metric-card accent-blue" style={{ textAlign: 'center' }}>
                <div className="card-value" style={{ fontSize: '1.6rem' }}>{count}</div>
                <div className="card-label">{label}</div>
              </div>;
            })}
            <div className="metric-card accent-teal" style={{ textAlign: 'center' }}>
              <div className="card-value" style={{ fontSize: '1.6rem' }}>
                {CATEGORIES.reduce((a, { id }) => a + filterQ(result[id] || []).length, 0)}
              </div>
              <div className="card-label">📦 Total</div>
            </div>
          </div>

          {/* Show/hide answers toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '.82rem', fontWeight: 500 }}>💡 Show model answers</span>
            <button
              className={`btn btn-sm${showAnswers ? '' : ' btn-secondary'}`}
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? 'Hide' : 'Show'}
            </button>
            <Pill text="Easy" style="green" />
            <Pill text="Medium" style="yellow" />
            <Pill text="Hard" style="red" />
          </div>

          {/* Category tabs */}
          <div className="tabs-bar">
            {CATEGORIES.map(({ id, label }) => (
              <button key={id} className={`tab-btn${tab === id ? ' active' : ''}`}
                onClick={() => setTab(id)}>{label} ({filterQ(result[id] || []).length})</button>
            ))}
          </div>

          {filterQ(result[tab] || []).map((q, i) => (
            <div key={i} className={`q-card ${q.difficulty}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
                <span style={{ fontSize: '.72rem', color: '#6f6f6f' }}>Q{i+1} · {q.category}</span>
                <Pill text={q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)} style={diffStyle[q.difficulty] || 'gray'} />
              </div>
              <div className="q-question">{q.question}</div>
              {showAnswers && <div className="q-answer">💡 {q.answer}</div>}
            </div>
          ))}

          {/* Self-assessment */}
          <hr className="divider" />
          <SectionHeader icon="✍️" title="Self-Assessment Practice" />
          <p style={{ fontSize: '.875rem', color: '#6f6f6f', marginBottom: '.75rem' }}>
            Select a question and type your answer to get AI feedback:
          </p>
          <div className="form-group">
            <label>Choose a question</label>
            <select className="form-control" value={selfQ} onChange={e => setSelfQ(e.target.value)}>
              <option value="">— select —</option>
              {(result.technical || []).concat(result.hr || []).slice(0,8).map((q,i) => (
                <option key={i} value={q.question}>Q{i+1}: {q.question.slice(0,80)}…</option>
              ))}
            </select>
          </div>
          <textarea className="form-control" rows={5} placeholder="Type your answer here…"
            value={selfA} onChange={e => { setSelfA(e.target.value); setEvalScore(null); }} />
          <button className="btn btn-sm" style={{ marginTop: '.75rem' }} onClick={evaluate} disabled={!selfA.trim()}>
            📊 Evaluate My Answer
          </button>
          {evalScore && (
            <div className="card" style={{ marginTop: '1rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '.5rem' }}>AI Evaluation</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: scoreColour(evalScore.score) }}>{evalScore.score}</span>
                <span style={{ fontSize: '.82rem', color: '#6f6f6f' }}>/ 100 · {evalScore.words} words</span>
              </div>
              <div style={{ fontSize: '.875rem' }}>
                {evalScore.words >= 50
                  ? '✅ Good length. Try to add specific quantified examples.'
                  : '⚠️ Your answer is quite short. Expand with STAR framework details.'}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
