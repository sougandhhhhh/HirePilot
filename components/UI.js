// HirePilot AI – Shared UI primitives

// ── Score colour ──────────────────────────────────────────────
export function scoreColour(score) {
  if (score >= 80) return '#42be65';
  if (score >= 60) return '#f1c21b';
  if (score >= 40) return '#ff832b';
  return '#fa4d56';
}

// ── SVG circular gauge ────────────────────────────────────────
export function Gauge({ score, label, size = 120 }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const colour = scoreColour(score);
  return (
    <div className="gauge-wrap">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={colour} strokeWidth="10"
          strokeDasharray={`${circ.toFixed(1)}`}
          strokeDashoffset={`${offset.toFixed(1)}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" textAnchor="middle" dy="0.35em"
          fontSize="18" fontWeight="700" fill="#161616"
          fontFamily="IBM Plex Sans, sans-serif">
          {score}
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────
export function ProgressBar({ label, value, colour }) {
  const c = colour || scoreColour(value);
  return (
    <div className="progress-row">
      <div className="progress-label-row">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="progress-bg">
        <div className="progress-fill" style={{ width: `${value}%`, background: c }} />
      </div>
    </div>
  );
}

// ── Metric card ──────────────────────────────────────────────
export function MetricCard({ icon, value, label, delta, deltaUp = true, accent = 'blue' }) {
  return (
    <div className={`metric-card accent-${accent}`}>
      <span className="card-icon">{icon}</span>
      <div className="card-value">{value}</div>
      <div className="card-label">{label}</div>
      {delta && (
        <div className={`card-delta ${deltaUp ? 'delta-up' : 'delta-down'}`}>{delta}</div>
      )}
    </div>
  );
}

// ── Pill ────────────────────────────────────────────────────
export function Pill({ text, style = 'blue' }) {
  return <span className={`pill pill-${style}`}>{text}</span>;
}

// ── Section header ───────────────────────────────────────────
export function SectionHeader({ icon, title }) {
  return (
    <div className="section-header">
      {icon && <span>{icon}</span>}
      {title}
    </div>
  );
}

// ── Info box ─────────────────────────────────────────────────
export function InfoBox({ children, type = 'info' }) {
  const cls = { info: 'info-box', success: 'success-box', warn: 'warn-box' }[type] || 'info-box';
  return <div className={cls}>{children}</div>;
}

// ── Tabs ─────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs-bar">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`tab-btn${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Loading ──────────────────────────────────────────────────
export function Loading({ message = 'IBM watsonx AI is processing…' }) {
  return (
    <div className="loading-wrap">
      <div className="spinner" />
      <p style={{ marginTop: '.75rem' }}>{message}</p>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6f6f6f' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#161616', marginBottom: '.5rem' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '.875rem' }}>{subtitle}</div>}
    </div>
  );
}

// ── Roadmap ──────────────────────────────────────────────────
export function Roadmap({ steps }) {
  return (
    <div>
      {steps.map((s) => (
        <div className="roadmap-item" key={s.step}>
          <div className="roadmap-step">{s.step}</div>
          <div>
            <div className="roadmap-title">
              {s.title}
              {s.weeks && <span style={{ fontWeight: 400, fontSize: '.75rem', color: '#6f6f6f', marginLeft: '.5rem' }}>· {s.weeks} weeks</span>}
            </div>
            <div className="roadmap-detail">{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
