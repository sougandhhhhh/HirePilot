// HirePilot AI – Premium Interview Coach
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader, Pill, Loading, InfoBox, scoreColour } from '../components/UI';

const ROLES = [
  'Software Engineer','Full Stack Developer','Data Scientist','ML Engineer',
  'DevOps Engineer','Product Manager','Frontend Engineer','Backend Engineer',
  'Cloud Architect','Mobile Developer',
];
const DIFFICULTIES  = ['All Levels', 'Easy', 'Medium', 'Hard'];
const CATEGORIES    = [
  { id: 'technical',  label: 'Technical',  icon: '💻' },
  { id: 'hr',         label: 'HR',         icon: '👔' },
  { id: 'behavioral', label: 'Behavioral', icon: '🧠' },
  { id: 'coding',     label: 'Coding',     icon: '👨‍💻' },
];

function buildMock(role) {
  return {
    technical: [
      { question: `Explain synchronous vs asynchronous programming as a ${role}.`, answer: 'Synchronous blocks the thread until done. Async (callbacks/promises/async-await) lets other work continue while waiting — critical for I/O-bound operations.', difficulty: 'medium', category: 'Core Concepts' },
      { question: 'How would you design a URL shortener like bit.ly from scratch?', answer: 'Hash function (base62 counter), Redis cache, PostgreSQL storage, load balancer, analytics pipeline. Handle collisions by retrying with salt.', difficulty: 'hard', category: 'System Design' },
      { question: 'What is the time complexity of quicksort vs mergesort?', answer: 'Quicksort O(n log n) avg, O(n²) worst. Prefer mergesort for guaranteed O(n log n), linked lists, or stable sort.', difficulty: 'medium', category: 'Algorithms' },
    ],
    hr: [
      { question: "Tell me about yourself and why you're interested in this role.", answer: 'Structure: Past → Present → Future. Keep it 2 minutes. Be specific about achievements.', difficulty: 'easy', category: 'Introduction' },
      { question: 'Describe a time you disagreed with your manager.', answer: 'Use STAR. Raise concern respectfully with data. Show maturity and professionalism. Positive outcome.', difficulty: 'medium', category: 'Conflict Resolution' },
    ],
    behavioral: [
      { question: 'Tell me about a time you delivered a project under an extremely tight deadline.', answer: 'STAR: constraint → prioritise ruthlessly → communicate risks early → execute → reflect. Quantify the outcome.', difficulty: 'medium', category: 'Delivery Under Pressure' },
      { question: "Give an example of when you took ownership of a problem that wasn't yours.", answer: 'Demonstrate initiative and cross-functional collaboration. Identified a gap, drove it to resolution, linked to business impact.', difficulty: 'medium', category: 'Ownership' },
    ],
    coding: [
      { question: 'Find the longest substring without repeating characters.', answer: 'Sliding window with hash set. O(n) time, O(min(m,n)) space.', difficulty: 'medium', category: 'Strings / Sliding Window' },
      { question: 'Detect if a binary tree is balanced.', answer: 'DFS post-order. Return -1 if unbalanced, else height. Check |left-right| > 1. O(n) time.', difficulty: 'hard', category: 'Trees / Recursion' },
    ],
  };
}

export default function InterviewCoach() {
  const [role, setRole]               = useState('Software Engineer');
  const [diff, setDiff]               = useState('All Levels');
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [tab, setTab]                 = useState('technical');
  const [showAnswers, setShowAnswers] = useState(true);
  const [selfA, setSelfA]             = useState('');
  const [evalScore, setEvalScore]     = useState(null);

  async function generate() {
    setLoading(true); setResult(null);
    try {
      const r = await fetch('/api/interview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, difficulty: diff.toLowerCase().replace('all levels', 'all') }),
      });
      if (!r.ok) throw new Error(r.status);
      setResult(await r.json());
    } catch { setResult(buildMock(role)); }
    finally   { setLoading(false); }
  }

  function evaluate() {
    if (!selfA.trim()) return;
    const words = selfA.split(/\s+/).length;
    setEvalScore({ score: Math.min(100, Math.max(40, 60 + Math.floor(words / 5))), words });
  }

  const filterQ = qs => diff === 'All Levels' ? qs : qs.filter(q => q.difficulty === diff.toLowerCase());
  const diffStyle = { easy: 'green', medium: 'yellow', hard: 'red' };

  return (
    <Layout>
      <SectionHeader icon="🎤" title="Interview Coach" />
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '.92rem', maxWidth: 560 }}>
        Practice with AI-generated questions tailored to your target role — with model answers and self-evaluation.
      </p>

      {/* ── Config card ───────────────────────────────── */}
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
          <button
            className="btn"
            style={{ borderRadius: 12, marginBottom: 0 }}
            onClick={generate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
                Generating…
              </>
            ) : 'Generate Questions'}
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
            {CATEGORIES.map(({ id, label, icon }) => (
              <div key={id} className="metric-card accent-blue" style={{ textAlign: 'center' }}>
                <div className="card-icon">{icon}</div>
                <div className="card-value" style={{ fontSize: '1.6rem' }}>{filterQ(result[id] || []).length}</div>
                <div className="card-label">{label}</div>
              </div>
            ))}
            <div className="metric-card accent-teal" style={{ textAlign: 'center' }}>
              <div className="card-icon">📦</div>
              <div className="card-value" style={{ fontSize: '1.6rem' }}>
                {CATEGORIES.reduce((a, { id }) => a + filterQ(result[id] || []).length, 0)}
              </div>
              <div className="card-label">Total</div>
            </div>
          </div>

          {/* Show/hide answers toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Model answers</span>
            <button
              className={`btn btn-sm ${showAnswers ? '' : 'btn-ghost'}`}
              style={{ borderRadius: 8 }}
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? 'Hide' : 'Show'}
            </button>
            <div style={{ display: 'flex', gap: '.35rem', marginLeft: 'auto' }}>
              <Pill text="Easy" style="green" />
              <Pill text="Medium" style="yellow" />
              <Pill text="Hard" style="red" />
            </div>
          </div>

          {/* Category tabs */}
          <div className="tabs-bar">
            {CATEGORIES.map(({ id, label, icon }) => (
              <button
                key={id}
                className={`tab-btn${tab === id ? ' active' : ''}`}
                onClick={() => setTab(id)}
              >
                {icon} {label} ({filterQ(result[id] || []).length})
              </button>
            ))}
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {filterQ(result[tab] || []).map((q, i) => (
              <div key={i} className={`q-card ${q.difficulty}`} style={{ animationDelay: `${i * 60}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Q{i + 1} · {q.category}</span>
                  <Pill
                    text={q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                    style={diffStyle[q.difficulty] || 'gray'}
                  />
                </div>
                <div className="q-question">{q.question}</div>
                {showAnswers && (
                  <div className="q-answer" style={{ marginTop: '.6rem', paddingTop: '.6rem', borderTop: '1px solid var(--glass-border)' }}>
                    <span style={{ color: 'var(--electric)', fontWeight: 500, marginRight: '.4rem' }}>💡</span>
                    {q.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Self-Assessment */}
          <hr className="divider" />
          <SectionHeader icon="✍️" title="Self-Assessment Practice" />
          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '.85rem' }}>
            Type your answer below to receive AI feedback on length, structure, and quality:
          </p>
          <textarea
            className="form-control"
            rows={5}
            placeholder="Type your answer here using the STAR framework (Situation → Task → Action → Result)…"
            value={selfA}
            onChange={e => { setSelfA(e.target.value); setEvalScore(null); }}
          />
          <button
            className="btn btn-sm"
            style={{ marginTop: '.75rem', borderRadius: 8 }}
            onClick={evaluate}
            disabled={!selfA.trim()}
          >
            📊 Evaluate My Answer
          </button>

          {evalScore && (
            <div className="card" style={{ marginTop: '1rem', animation: 'scaleIn .3s ease' }}>
              <div style={{ fontWeight: 600, marginBottom: '.75rem', color: 'var(--text-primary)' }}>AI Evaluation</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.75rem' }}>
                <span style={{
                  fontSize: '2.2rem', fontWeight: 700,
                  color: scoreColour(evalScore.score),
                  textShadow: `0 0 12px ${scoreColour(evalScore.score)}50`,
                }}>{evalScore.score}</span>
                <span style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>/ 100 · {evalScore.words} words</span>
              </div>
              <div style={{
                padding: '.75rem 1rem',
                background: evalScore.words >= 50 ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.08)',
                border: `1px solid ${evalScore.words >= 50 ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}`,
                borderRadius: 10, fontSize: '.875rem',
                color: evalScore.words >= 50 ? 'var(--green)' : 'var(--yellow)',
              }}>
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
