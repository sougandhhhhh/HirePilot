// HirePilot AI – Application Tracker page
import { useState } from 'react';
import Layout from '../components/Layout';
import { SectionHeader } from '../components/UI';

const STATUS_LIST  = ['Applied','Screening','Interview','Technical Test','Offer','Rejected','Withdrawn'];
const OFFER_STATUS = ['Pending','Received','Negotiating','Accepted','Declined'];

const BADGE_CLASS = {
  Applied: 'badge-applied', Screening: 'badge-screening',
  Interview: 'badge-interview', 'Technical Test': 'badge-pending',
  Offer: 'badge-offer', Rejected: 'badge-rejected', Withdrawn: 'badge-pending',
};

const DEMO_APPS = [
  { company:'Stripe',      role:'Senior Software Engineer', applied_date:'Jan 10, 2025', status:'Interview',  interview_date:'Jan 20, 2025', offer_status:'Pending',    salary:'$145K–$185K', location:'San Francisco, CA' },
  { company:'Cloudflare',  role:'Software Engineer',        applied_date:'Jan 08, 2025', status:'Screening',  interview_date:'—',            offer_status:'Pending',    salary:'$130K–$165K', location:'Remote' },
  { company:'Databricks',  role:'Software Engineer II',     applied_date:'Jan 05, 2025', status:'Applied',    interview_date:'—',            offer_status:'Pending',    salary:'$140K–$175K', location:'San Francisco, CA' },
  { company:'Figma',       role:'Staff Software Engineer',  applied_date:'Dec 28, 2024', status:'Rejected',   interview_date:'Jan 03, 2025', offer_status:'N/A',        salary:'$155K–$200K', location:'New York, NY' },
  { company:'IBM',         role:'AI Software Engineer',     applied_date:'Dec 20, 2024', status:'Offer',      interview_date:'Dec 30, 2024', offer_status:'Negotiating',salary:'$135K–$160K', location:'Remote' },
];

export default function Tracker() {
  const [apps, setApps]         = useState(DEMO_APPS);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [newApp, setNewApp]     = useState({
    company:'', role:'', applied_date:'', status:'Applied',
    interview_date:'', offer_status:'Pending', salary:'', location:'',
  });

  const filtered = apps.filter(a => {
    const s = search.toLowerCase();
    const matchSearch = !s || a.company.toLowerCase().includes(s) || a.role.toLowerCase().includes(s);
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function addApp() {
    if (!newApp.company.trim() || !newApp.role.trim()) return;
    setApps(prev => [...prev, { ...newApp, applied_date: newApp.applied_date || new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}) }]);
    setNewApp({ company:'', role:'', applied_date:'', status:'Applied', interview_date:'', offer_status:'Pending', salary:'', location:'' });
    setShowAdd(false);
  }

  const totalApps    = apps.length;
  const interviews   = apps.filter(a => ['Interview','Technical Test'].includes(a.status)).length;
  const offers       = apps.filter(a => a.status === 'Offer').length;
  const rejected     = apps.filter(a => a.status === 'Rejected').length;
  const responseRate = totalApps ? Math.round((totalApps - rejected) / totalApps * 100) : 0;
  const upcoming     = apps.filter(a => a.interview_date !== '—' && ['Interview','Screening','Technical Test'].includes(a.status));

  return (
    <Layout title="Application Tracker">
      <SectionHeader icon="📋" title="Application Tracker" />
      <p style={{ color:'#6f6f6f', marginBottom:'1.5rem', fontSize:'.9rem' }}>
        Track every application, interview, and outcome in one organised view.
      </p>

      {/* KPIs */}
      <div className="metrics-grid" style={{ gridTemplateColumns:'repeat(5,1fr)', marginBottom:'1.5rem' }}>
        {[
          { icon:'📤', v:totalApps,       l:'Total Applied',   a:'blue' },
          { icon:'🗓️', v:interviews,      l:'Interviews',      a:'green' },
          { icon:'🎉', v:offers,          l:'Offers',          a:'teal' },
          { icon:'❌', v:rejected,        l:'Rejected',        a:'red' },
          { icon:'📈', v:`${responseRate}%`, l:'Response Rate', a:'purple' },
        ].map(({ icon, v, l, a }) => (
          <div key={l} className={`metric-card accent-${a}`} style={{ textAlign:'center' }}>
            <span className="card-icon">{icon}</span>
            <div className="card-value">{v}</div>
            <div className="card-label">{l}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'1rem', alignItems:'center' }}>
        <input className="form-control" placeholder="🔍 Search company or role…" style={{ maxWidth:260 }}
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-control" style={{ maxWidth:180 }}
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-sm" onClick={() => setShowAdd(!showAdd)}>➕ Add Application</button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="card" style={{ marginBottom:'1.25rem' }}>
          <h4 style={{ marginBottom:'1rem', fontSize:'.95rem' }}>➕ New Application</h4>
          <div className="col-3">
            {[
              { key:'company', label:'Company',      placeholder:'e.g. Stripe' },
              { key:'role',    label:'Role',          placeholder:'e.g. Senior Engineer' },
              { key:'location',label:'Location',      placeholder:'Remote' },
              { key:'salary',  label:'Salary',        placeholder:'$XX–$YYK' },
              { key:'applied_date', label:'Applied Date', placeholder:'Jan 01, 2025' },
              { key:'interview_date', label:'Interview Date', placeholder:'—' },
            ].map(({ key, label, placeholder }) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <input className="form-control" placeholder={placeholder}
                  value={newApp[key]} onChange={e => setNewApp(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'1rem' }}>
            <div className="form-group" style={{ flex:1 }}>
              <label>Status</label>
              <select className="form-control" value={newApp.status} onChange={e => setNewApp(p => ({ ...p, status: e.target.value }))}>
                {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:'.75rem' }}>
            <button className="btn btn-sm" onClick={addApp}>✅ Save</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX:'auto', border:'1px solid #e5e7eb', borderRadius:4 }}>
        <table className="data-table">
          <thead>
            <tr>
              {['Company','Role','Applied','Status','Interview','Offer','Salary'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight:600 }}>{a.company}</td>
                <td style={{ color:'#6f6f6f' }}>{a.role}</td>
                <td>{a.applied_date}</td>
                <td><span className={`badge ${BADGE_CLASS[a.status] || 'badge-applied'}`}>{a.status}</span></td>
                <td>{a.interview_date}</td>
                <td style={{ color:'#6f6f6f' }}>{a.offer_status}</td>
                <td>{a.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding:'.5rem 1rem', fontSize:'.72rem', color:'#6f6f6f', textAlign:'right' }}>
          Showing {filtered.length} of {apps.length} applications
        </div>
      </div>

      {/* Upcoming interviews */}
      {upcoming.length > 0 && (
        <>
          <div style={{ height:'1.5rem' }} />
          <SectionHeader icon="🗓️" title="Upcoming Interviews" />
          {upcoming.map((a, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.75rem 1.2rem', background:'#edf5ff', border:'1px solid #d0e2ff', borderLeft:'4px solid #0f62fe', borderRadius:4, marginBottom:'.5rem' }}>
              <div><strong>{a.company}</strong> – <span style={{ color:'#6f6f6f' }}>{a.role}</span></div>
              <div style={{ fontSize:'.82rem', color:'#0043ce', fontWeight:500 }}>🗓️ {a.interview_date}</div>
            </div>
          ))}
        </>
      )}
    </Layout>
  );
}
