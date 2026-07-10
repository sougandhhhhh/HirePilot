// HirePilot AI – Premium Application Tracker (Kanban Board)
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader } from '../components/UI';

const KANBAN_COLS = [
  { id: 'Saved',      label: 'Saved',      icon: '🔖', color: '#64748b' },
  { id: 'Applied',    label: 'Applied',    icon: '📤', color: '#0F62FE' },
  { id: 'Assessment', label: 'Assessment', icon: '📝', color: '#fbbf24' },
  { id: 'Interview',  label: 'Interview',  icon: '🗓️', color: '#a78bfa' },
  { id: 'Offer',      label: 'Offer',      icon: '🎉', color: '#34d399' },
  { id: 'Rejected',   label: 'Rejected',   icon: '❌', color: '#f87171' },
];

const STATUS_LIST  = ['Applied', 'Screening', 'Assessment', 'Interview', 'Technical Test', 'Offer', 'Rejected', 'Withdrawn', 'Saved'];
const OFFER_STATUS = ['Pending', 'Received', 'Negotiating', 'Accepted', 'Declined'];

const BADGE_COLORS = {
  Applied:     '#0F62FE',
  Screening:   '#a78bfa',
  Interview:   '#34d399',
  Assessment:  '#fbbf24',
  'Technical Test': '#fbbf24',
  Offer:       '#34d399',
  Rejected:    '#f87171',
  Withdrawn:   '#64748b',
  Saved:       '#64748b',
};


function KanbanCard({ app, onMove }) {
  const c = BADGE_COLORS[app.status] || '#64748b';
  return (
    <div className="kanban-card">
      <div className="kanban-card-company">{app.company}</div>
      <div className="kanban-card-role">{app.role}</div>
      <div className="kanban-card-meta">
        <span style={{ color: '#34d399' }}>💰 {app.salary}</span>
      </div>
      <div className="kanban-card-meta" style={{ marginTop: '.4rem' }}>
        <span>📍 {app.location}</span>
      </div>
      {app.interview_date !== '—' && (
        <div style={{ marginTop: '.5rem', fontSize: '.7rem', color: '#a78bfa' }}>
          🗓️ {app.interview_date}
        </div>
      )}
    </div>
  );
}

export default function Tracker() {
  const [apps, setApps]         = useState([]);
  const [search, setSearch]     = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [view, setView]         = useState('kanban'); // 'kanban' | 'table'
  const [newApp, setNewApp]     = useState({
    company: '', role: '', applied_date: '', status: 'Applied',
    interview_date: '', offer_status: 'Pending', salary: '', location: '',
  });

  function addApp() {
    if (!newApp.company.trim() || !newApp.role.trim()) return;
    setApps(prev => [...prev, {
      ...newApp,
      applied_date: newApp.applied_date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    }]);
    setNewApp({ company: '', role: '', applied_date: '', status: 'Applied', interview_date: '', offer_status: 'Pending', salary: '', location: '' });
    setShowAdd(false);
  }

  const filtered = apps.filter(a => {
    const s = search.toLowerCase();
    return !s || a.company.toLowerCase().includes(s) || a.role.toLowerCase().includes(s);
  });

  const totalApps    = apps.length;
  const interviews   = apps.filter(a => ['Interview', 'Technical Test'].includes(a.status)).length;
  const offers       = apps.filter(a => a.status === 'Offer').length;
  const rejected     = apps.filter(a => a.status === 'Rejected').length;
  const responseRate = totalApps ? Math.round((totalApps - rejected) / totalApps * 100) : 0;

  const getColApps = (colId) => filtered.filter(a => a.status === colId);

  return (
    <Layout>
      <SectionHeader icon="📋" title="Application Tracker" />
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '.92rem', maxWidth: 560 }}>
        Track every application, interview, and outcome in a Kanban board.
      </p>

      {/* ── KPI Stats ───────────────────────────────── */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: '1.5rem' }}>
        {[
          { icon: '📤', v: totalApps,          l: 'Total Applied',   a: 'blue' },
          { icon: '🗓️', v: interviews,         l: 'Interviews',      a: 'purple' },
          { icon: '🎉', v: offers,             l: 'Offers',          a: 'green' },
          { icon: '❌', v: rejected,           l: 'Rejected',        a: 'red' },
          { icon: '📈', v: `${responseRate}%`, l: 'Response Rate',   a: 'cyan' },
        ].map(({ icon, v, l, a }) => (
          <div key={l} className={`metric-card accent-${a}`} style={{ textAlign: 'center' }}>
            <span className="card-icon">{icon}</span>
            <div className="card-value">{v}</div>
            <div className="card-label">{l}</div>
          </div>
        ))}
      </div>

      {/* ── Controls ────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
        <div className="nav-search" style={{ maxWidth: 280 }}>
          <span className="nav-search-icon">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search company or role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '.3rem', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '3px' }}>
          {[{ id: 'kanban', label: '⬛ Kanban' }, { id: 'table', label: '▤ Table' }].map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                padding: '.35rem .75rem', border: 'none', borderRadius: 8,
                fontSize: '.78rem', fontWeight: 500, cursor: 'pointer',
                background: view === v.id ? 'var(--ibm-blue)' : 'transparent',
                color: view === v.id ? '#fff' : 'var(--text-muted)',
                transition: 'all .2s ease',
              }}
            >{v.label}</button>
          ))}
        </div>

        <button className="btn btn-sm" style={{ borderRadius: 8, marginLeft: 'auto' }} onClick={() => setShowAdd(!showAdd)}>
          ➕ Add Application
        </button>
      </div>

      {/* ── Add Form ─────────────────────────────────── */}
      {showAdd && (
        <div className="card" style={{ marginBottom: '1.25rem', animation: 'slideUp .3s ease' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '.95rem', color: 'var(--text-primary)' }}>➕ New Application</h4>
          <div className="col-3">
            {[
              { key: 'company',        label: 'Company',        placeholder: 'e.g. Stripe' },
              { key: 'role',           label: 'Role',           placeholder: 'e.g. Senior Engineer' },
              { key: 'location',       label: 'Location',       placeholder: 'Remote' },
              { key: 'salary',         label: 'Salary',         placeholder: '$XX–$YYK' },
              { key: 'applied_date',   label: 'Applied Date',   placeholder: 'Jan 01, 2025' },
              { key: 'interview_date', label: 'Interview Date', placeholder: '—' },
            ].map(({ key, label, placeholder }) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <input className="form-control" placeholder={placeholder}
                  value={newApp[key]} onChange={e => setNewApp(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div className="form-group" style={{ maxWidth: 200 }}>
            <label>Status</label>
            <select className="form-control" value={newApp.status} onChange={e => setNewApp(p => ({ ...p, status: e.target.value }))}>
              {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '.75rem' }}>
            <button className="btn btn-sm" style={{ borderRadius: 8 }} onClick={addApp}>✅ Save</button>
            <button className="btn btn-ghost btn-sm" style={{ borderRadius: 8 }} onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Kanban Board ─────────────────────────────── */}
      {view === 'kanban' && (
        <div className="kanban-board">
          {KANBAN_COLS.map((col) => {
            const colApps = getColApps(col.id);
            return (
              <div key={col.id} className="kanban-col">
                <div className="kanban-col-header">
                  <div className="kanban-col-title">
                    <span style={{ color: col.color }}>{col.icon}</span>
                    {col.label}
                  </div>
                  <span className="kanban-count">{colApps.length}</span>
                </div>
                {colApps.length === 0 && (
                  <div style={{
                    textAlign: 'center', padding: '1.5rem .5rem',
                    color: 'var(--text-muted)', fontSize: '.75rem',
                    border: '1px dashed var(--glass-border)',
                    borderRadius: 12,
                  }}>
                    No applications
                  </div>
                )}
                {colApps.map((app, i) => (
                  <KanbanCard key={i} app={app} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Table View ────────────────────────────────── */}
      {view === 'table' && (
        <div style={{ overflowX: 'auto', border: '1px solid var(--glass-border)', borderRadius: 16, animation: 'fadeIn .3s ease' }}>
          <table className="data-table">
            <thead>
              <tr>
                {['Company', 'Role', 'Applied', 'Status', 'Interview', 'Offer', 'Salary'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const c = BADGE_COLORS[a.status] || '#64748b';
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.company}</td>
                    <td>{a.role}</td>
                    <td>{a.applied_date}</td>
                    <td>
                      <span style={{
                        background: `${c}20`,
                        color: c,
                        padding: '.18rem .6rem',
                        borderRadius: 999,
                        fontSize: '.68rem', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '.4px',
                      }}>{a.status}</span>
                    </td>
                    <td>{a.interview_date}</td>
                    <td>{a.offer_status}</td>
                    <td style={{ color: 'var(--green)', fontWeight: 500 }}>{a.salary}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: '.5rem 1rem', fontSize: '.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            Showing {filtered.length} of {apps.length} applications
          </div>
        </div>
      )}
    </Layout>
  );
}
