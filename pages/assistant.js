// HirePilot AI – Premium AI Assistant (IBM watsonx Orchestrate)
import Layout from '../components/Layout';
import { SectionHeader, Pill } from '../components/UI';

const CFG = {
  orchestrationID:    '8254d45b2e8c49f397fed4f4efda4474_82de1835-3f80-482d-864e-7b0c75121f2f',
  hostURL:            'https://au-syd.watson-orchestrate.cloud.ibm.com',
  deploymentPlatform: 'ibmcloud',
  crn:                'crn:v1:bluemix:public:watsonx-orchestrate:au-syd:a/8254d45b2e8c49f397fed4f4efda4474:82de1835-3f80-482d-864e-7b0c75121f2f::',
  agentId:            '066f1a0a-dec9-4dc8-8462-23b617d50639',
  agentEnvironmentId: '6b0c667f-8cb8-43d0-bc81-098baaf81a36',
};

// Self-contained iframe HTML that boots the wxoLoader
const AGENT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;font-family:'IBM Plex Sans',system-ui,sans-serif;background:#0B1120;overflow:hidden}
  #root{height:100%;width:100%}
  #root iframe,#root>div{width:100%!important;height:100%!important;border:none!important}
  #ld{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:.75rem;background:#0B1120}
  .sp{width:36px;height:36px;border:3px solid rgba(15,98,254,0.2);border-top-color:#0f62fe;
      border-radius:50%;animation:spin .7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .ld-brand{font-size:1rem;font-weight:700;color:#f0f6ff}
  .ld-text{font-size:.82rem;color:#94a3b8}
  .err{text-align:center;padding:2rem;color:#94a3b8}
  .err h3{color:#f0f6ff;margin-bottom:.5rem}
</style>
</head>
<body>
<div id="root">
  <div id="ld">
    <div class="ld-brand">✈ HirePilot AI</div>
    <div class="sp"></div>
    <div class="ld-text">Connecting to IBM watsonx Orchestrate…</div>
  </div>
</div>
<script>
  window.wxOConfiguration = {
    orchestrationID:    '${CFG.orchestrationID}',
    hostURL:            '${CFG.hostURL}',
    rootElementID:      'root',
    deploymentPlatform: '${CFG.deploymentPlatform}',
    crn:                '${CFG.crn}',
    chatOptions: {
      agentId:            '${CFG.agentId}',
      agentEnvironmentId: '${CFG.agentEnvironmentId}'
    }
  };
  setTimeout(function() {
    var s = document.createElement('script');
    s.src = '${CFG.hostURL}/wxochat/wxoLoader.js?embed=true';
    s.onload = function() {
      wxoLoader.init();
      var ld = document.getElementById('ld');
      if (ld) { ld.style.opacity='0'; setTimeout(function(){ld.remove()},400); }
    };
    s.onerror = function() {
      var ld = document.getElementById('ld');
      if (ld) ld.innerHTML = '<div class="err"><h3>⚠️ Could not load agent</h3><p>Check your network and watsonx Orchestrate credentials.</p></div>';
    };
    document.head.appendChild(s);
  }, 0);
</script>
</body>
</html>`;

const CAPABILITIES = [
  { text: '📄 Resume Analysis',    style: 'blue'   },
  { text: '🔍 Job Matching',        style: 'cyan'   },
  { text: '🎤 Interview Prep',      style: 'purple' },
  { text: '🧩 Skill Gap Advice',    style: 'teal'   },
  { text: '✉️ Cover Letter Help',   style: 'yellow' },
  { text: '🚀 Career Strategy',     style: 'red'    },
  { text: '💰 Salary Insights',     style: 'green'  },
  { text: '🏢 Company Research',    style: 'gray'   },
];

const PROMPTS = [
  '📄 Analyze my resume and give me an ATS score',
  '🔍 Find me senior engineer jobs in San Francisco',
  '🧩 What skills am I missing for a Staff Engineer role?',
  '🎤 Give me 5 hard system design interview questions',
  '✉️ Write a cover letter for a role at Stripe',
  '🚀 What will my salary be in 3 years?',
];

export default function Assistant() {
  return (
    <Layout>
      {/* ── Header ──────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SectionHeader icon="🤖" title="AI Assistant" />
        <p style={{ color: 'var(--text-muted)', fontSize: '.92rem', maxWidth: 560 }}>
          Chat with your IBM watsonx Orchestrate career agent — ask about your resume,
          job matches, interview prep, or any career topic.
        </p>
      </div>

      {/* ── Capability pills ────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1.5rem' }}>
        {CAPABILITIES.map(({ text, style }) => (
          <Pill key={text} text={text} style={style} />
        ))}
      </div>

      {/* ── Embedded agent ──────────────────────────── */}
      <div style={{
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(15,98,254,0.15)',
        position: 'relative',
      }}>
        {/* Header bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15,98,254,0.15) 0%, rgba(34,211,238,0.1) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '.85rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '.85rem',
        }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--ibm-blue), var(--cyan-dim))',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: '0 0 12px rgba(15,98,254,0.4)',
          }}>✈</div>
          <div>
            <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              HirePilot AI Career Agent
            </div>
            <div style={{ fontSize: '.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', display: 'inline-block' }} />
              IBM watsonx Orchestrate · Live
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '.4rem' }}>
            {['🔊', '📎'].map((icon, i) => (
              <button key={i} style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.85rem',
              }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Agent iframe */}
        <iframe
          title="HirePilot AI – watsonx Orchestrate Agent"
          srcDoc={AGENT_HTML}
          style={{ width: '100%', height: 660, border: 'none', display: 'block' }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation allow-storage-access-by-user-activation allow-popups-to-escape-sandbox"
        />
      </div>

      {/* ── Suggested prompts ────────────────────────── */}
      <div style={{ marginTop: '1.75rem' }}>
        <div style={{
          fontSize: '.72rem', fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '.8px', marginBottom: '.85rem',
          display: 'flex', alignItems: 'center', gap: '.5rem',
        }}>
          <span>✦</span> Suggested Prompts
        </div>
        <div className="col-3">
          {PROMPTS.map((p, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 14,
              padding: '.75rem 1rem',
              fontSize: '.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              cursor: 'pointer',
              transition: 'all .2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ibm-blue-soft)'; e.currentTarget.style.borderColor = 'rgba(15,98,254,0.3)'; e.currentTarget.style.color = 'var(--electric)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
