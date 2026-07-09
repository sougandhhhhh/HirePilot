// HirePilot AI – Dashboard page
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Gauge, MetricCard, ProgressBar, SectionHeader, Loading } from '../components/UI';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Layout title="Dashboard">
      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-badge">✦ Powered by IBM watsonx AI</div>
        <h1>HirePilot AI – Your Intelligent Career Assistant</h1>
        <p>
          Analyze your resume, identify skill gaps, prepare for interviews,
          generate cover letters, and track your applications using IBM Agentic AI.
        </p>
      </div>

      {loading && <Loading />}
      {data && (
        <>
          <SectionHeader icon="📊" title="Career Overview" />
          <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            <MetricCard icon="🎯" value={`${data.career_readiness_score}%`} label="Career Readiness"   delta="↑ 5% this week"   deltaUp accent="blue" />
            <MetricCard icon="📄" value={data.ats_score}                    label="ATS Resume Score"    delta="↑ 8 pts"          deltaUp accent="green" />
            <MetricCard icon="💼" value={data.recommended_jobs}             label="Recommended Jobs"    delta="+3 new today"     deltaUp accent="teal" />
            <MetricCard icon="🎤" value={`${data.interview_readiness}%`}    label="Interview Readiness" delta="↑ 3% this week"   deltaUp accent="purple" />
            <MetricCard icon="🧩" value={`${data.skill_gap_score}%`}        label="Skill Gap Score"     delta="↓ 2% (good!)"  deltaUp={false} accent="yellow" />
          </div>

          <div className="col-2" style={{ marginTop: '1.5rem' }}>
            {/* Left: gauges + bars */}
            <div>
              <SectionHeader icon="📈" title="Score Breakdown" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <Gauge score={data.career_readiness_score} label="Career Readiness" />
                <Gauge score={data.ats_score}              label="ATS Score" />
                <Gauge score={data.interview_readiness}    label="Interview Ready" />
                <Gauge score={data.skill_gap_score}        label="Skill Fit" />
              </div>
              <SectionHeader icon="💪" title="Profile Strength" />
              <ProgressBar label="Profile Completeness"  value={data.profile_strength || 88} />
              <ProgressBar label="Resume Quality"        value={data.ats_score} />
              <ProgressBar label="Interview Readiness"   value={data.interview_readiness} />
              <ProgressBar label="Skill Fit"             value={data.skill_gap_score} />
            </div>

            {/* Right: activity + quick actions */}
            <div>
              <SectionHeader icon="📋" title="Application Statistics" />
              <div className="col-2" style={{ marginBottom: '1.5rem' }}>
                <MetricCard icon="📤" value="12" label="Applications Sent"    accent="blue" />
                <MetricCard icon="🗓️" value="3"  label="Interviews Scheduled" accent="green" />
              </div>

              <SectionHeader icon="⚡" title="Recent Activity" />
              {(data.recent_activity || []).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '.75rem', padding: '.7rem 0', borderBottom: '1px solid #f4f4f4' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0f62fe', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '.875rem' }}>{a.action}</div>
                    <div style={{ fontSize: '.75rem', color: '#6f6f6f' }}>{a.time}</div>
                  </div>
                </div>
              ))}

              <div style={{ height: '1rem' }} />
              <SectionHeader icon="⚡" title="Quick Actions" />
              <div className="col-2">
                {[
                  { href: '/resume',       label: '📄 Analyze Resume' },
                  { href: '/jobs',         label: '🔍 Match Jobs' },
                  { href: '/interview',    label: '🎤 Practice Interview' },
                  { href: '/cover-letter', label: '✉️ Cover Letter' },
                ].map(({ href, label }) => (
                  <a key={href} href={href} className="btn btn-secondary btn-full"
                    style={{ marginBottom: '.5rem' }}>{label}</a>
                ))}
              </div>

              <div className="info-box" style={{ marginTop: '1.25rem' }}>
                ℹ️ All AI insights are powered by IBM watsonx Orchestrate.
                Connect your API key in environment settings to activate live agents.
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
