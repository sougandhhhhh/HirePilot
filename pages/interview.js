// HirePilot AI – Premium Interview Coach
import { useState } from 'react';
import { SectionHeader, Pill, Loading, InfoBox, scoreColour } from '../components/UI';

const ROLES = [
  'Software Engineer','Full Stack Developer','Data Scientist','ML Engineer',
  'DevOps Engineer','Product Manager','Frontend Engineer','Backend Engineer',
  'Cloud Architect','Mobile Developer','Other',
];
const DIFFICULTIES  = ['All Levels', 'Easy', 'Medium', 'Hard'];
const CATEGORIES    = [
  { id: 'technical',  label: 'Technical',  icon: '💻' },
  { id: 'hr',         label: 'HR',         icon: '👔' },
  { id: 'behavioral', label: 'Behavioral', icon: '🧠' },
  { id: 'coding',     label: 'Coding',     icon: '👨‍💻' },
];

export default function InterviewCoach() {
  const [role, setRole]               = useState('Software Engineer');
  const [customRole, setCustomRole]   = useState('');
  const [diff, setDiff]               = useState('All Levels');
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [tab, setTab]                 = useState('technical');
  const [showAnswers, setShowAnswers] = useState(true);
  const [selfA, setSelfA]             = useState('');
  const [evalScore, setEvalScore]     = useState(null);

  const effectiveRole = role === 'Other' ? customRole : role;

  async function generate() {
    setLoading(true); setResult(null);
    const prompt = `You are an interview coach. Generate 1 interview question per category for a ${effectiveRole} (difficulty: ${diff}). Be specific to this role — avoid generic questions anyone could answer. Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "technical": [{"question": "string", "answer": "string", "category": "Technical", "difficulty": "easy|medium|hard"}],
  "hr": [{"question": "string", "answer": "string", "category": "HR", "difficulty": "easy|medium|hard"}],
  "behavioral": [{"question": "string", "answer": "string", "category": "Behavioral", "difficulty": "easy|medium|hard"}],
  "coding": [{"question": "string", "answer": "string", "category": "Coding", "difficulty": "easy|medium|hard"}]
}`;

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
          technical: Array.isArray(parsed.technical) ? parsed.technical : [],
          hr: Array.isArray(parsed.hr) ? parsed.hr : [],
          behavioral: Array.isArray(parsed.behavioral) ? parsed.behavioral : [],
          coding: Array.isArray(parsed.coding) ? parsed.coding : [],
        });
        return;
      }
      throw new Error('Failed to parse AI response');
    } catch (err) {
      console.error('Interview error:', err);
      setResult({
        technical: [{ question: 'Error generating questions. Please try again.', answer: '', category: 'Technical', difficulty: 'easy' }],
        hr: [], behavioral: [], coding: [],
      });
    } finally {
      setLoading(false);
    }
  }

  async function evaluate() {
    if (!selfA.trim()) return;
    setEvalScore(null);
    const prompt = `Evaluate this interview answer. Rate it out of 100. Return ONLY valid JSON (no markdown): {"score": number, "feedback": "string", "improvements": "string"}

Answer: "${selfA.trim()}"`;

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
      const words = selfA.split(/\s+/).length;
      if (parsed) {
        setEvalScore({ score: parsed.score, feedback: parsed.feedback, improvements: parsed.improvements, words });
      } else {
        throw new Error('Parse failed');
      }
    } catch {
      const words = selfA.split(/\s+/).length;
      setEvalScore({ score: Math.min(100, Math.max(40, 60 + Math.floor(words / 5))), words, feedback: '', improvements: '' });
    }
  }

  const filterQ = qs => diff === 'All Levels' ? qs : qs.filter(q => q.difficulty === diff.toLowerCase());
  const diffStyle = { easy: 'green', medium: 'yellow', hard: 'red' };

  return (
    <>
      <SectionHeader icon="🎤" title="Interview Coach" />
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '.92rem', maxWidth: 560 }}>
        Practice with AI-generated questions tailored to your target role — with model answers and self-evaluation.
      </p>

      {/* ── Config card ───────────────────────────────── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 2, margin: 0 }}>
            <label>🎯 Target Role</label>
            <select className="form-control" value={role} onChange={e => { setRole(e.target.value); setCustomRole(''); }}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
            {role === 'Other' && (
              <input className="form-control" style={{ marginTop: '.5rem' }} placeholder="Enter your role..." value={customRole} onChange={e => setCustomRole(e.target.value)} />
            )}
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

      {loading && <Loading message="HirePilot AI is crafting your interview questions…" />}
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
              {evalScore.feedback && (
                <div style={{ padding: '.75rem 1rem', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10, fontSize: '.875rem', color: 'var(--text-secondary)', marginBottom: '.5rem' }}>
                  <strong style={{ color: 'var(--green)' }}>✅ Feedback:</strong> {evalScore.feedback}
                </div>
              )}
              {evalScore.improvements && (
                <div style={{ padding: '.75rem 1rem', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, fontSize: '.875rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--yellow)' }}>💡 Improvements:</strong> {evalScore.improvements}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
