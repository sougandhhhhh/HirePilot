// HirePilot AI – Premium UI Primitives

// ── Score colour ──────────────────────────────────────────────
export function scoreColour(score) {
  if (score >= 80) return '#34d399';
  if (score >= 60) return '#fbbf24';
  if (score >= 40) return '#fb923c';
  return '#f87171';
}

// ── SVG circular gauge ────────────────────────────────────────
export function Gauge({ score, label, size = 120 }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const colour = scoreColour(score);
  return (
    <div className="gauge-wrap">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* Glow */}
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={colour} strokeWidth="8"
          strokeDasharray={`${circ.toFixed(1)}`}
          strokeDashoffset={`${offset.toFixed(1)}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ filter: `drop-shadow(0 0 6px ${colour})`, transition: 'stroke-dashoffset .8s cubic-bezier(0.16,1,0.3,1)' }}
        />
        {/* Score text */}
        <text
          x="50" y="46" textAnchor="middle"
          fontSize="20" fontWeight="700" fill="#f0f6ff"
          fontFamily="IBM Plex Sans, sans-serif"
        >
          {score}
        </text>
        <text
          x="50" y="60" textAnchor="middle"
          fontSize="8" fill="#64748b"
          fontFamily="IBM Plex Sans, sans-serif"
        >
          /100
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
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color: c, fontWeight: 600 }}>{value}%</span>
      </div>
      <div className="progress-bg">
        <div
          className="progress-fill"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${c}99, ${c})` }}
        />
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
      {icon && <span className="sh-icon">{icon}</span>}
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
      <p>{message}</p>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
      <div style={{
        fontSize: '3rem', marginBottom: '1rem',
        filter: 'grayscale(0.3)',
      }}>{icon}</div>
      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '.5rem' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>{subtitle}</div>}
    </div>
  );
}

// ── Roadmap ──────────────────────────────────────────────────
export function Roadmap({ steps }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div className="roadmap-item" key={s.step} style={{ animationDelay: `${i * 80}ms` }}>
          <div className="roadmap-step">{s.step}</div>
          <div>
            <div className="roadmap-title">
              {s.title}
              {s.weeks && (
                <span style={{ fontWeight: 400, fontSize: '.73rem', color: 'var(--text-muted)', marginLeft: '.5rem' }}>
                  · {s.weeks} weeks
                </span>
              )}
            </div>
            <div className="roadmap-detail">{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stats row ────────────────────────────────────────────────
export function StatsRow({ stats }) {
  return (
    <div className="metrics-grid" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map((s, i) => (
        <div key={i} className={`metric-card accent-${s.accent || 'blue'}`} style={{ textAlign: 'center' }}>
          <span className="card-icon">{s.icon}</span>
          <div className="card-value" style={{ fontSize: '1.6rem' }}>{s.value}</div>
          <div className="card-label">{s.label}</div>
          {s.delta && (
            <div className={`card-delta ${s.deltaUp !== false ? 'delta-up' : 'delta-down'}`}>{s.delta}</div>
          )}
        </div>
      ))}
    </div>
  );
}
