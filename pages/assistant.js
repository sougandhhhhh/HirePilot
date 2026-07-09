// HirePilot AI – AI Assistant page (IBM watsonx Orchestrate embedded agent)
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
  html,body{height:100%;font-family:'IBM Plex Sans',system-ui,sans-serif;background:#f4f4f4;overflow:hidden}
  #root{height:100%;width:100%}
  #root iframe,#root>div{width:100%!important;height:100%!important;border:none!important}
  #ld{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:.75rem;background:#f4f4f4}
  .sp{width:36px;height:36px;border:3px solid #d0e2ff;border-top-color:#0f62fe;
      border-radius:50%;animation:spin .8s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .ld-brand{font-size:1rem;font-weight:700;color:#161616}
  .ld-text{font-size:.82rem;color:#6f6f6f}
  .err{text-align:center;padding:2rem;color:#6f6f6f}
  .err h3{color:#161616;margin-bottom:.5rem}
</style>
</head>
<body>
<div id="root">
  <div id="ld">
    <div class="ld-brand">✈️ HirePilot AI</div>
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
      if (ld) ld.innerHTML = '<div class="err"><h3>⚠️ Could not load agent</h3><p>Check your network connection and that the watsonx Orchestrate credentials are valid.</p></div>';
    };
    document.head.appendChild(s);
  }, 0);
</script>
</body>
</html>`;

const CAPABILITIES = [
  { text: '📄 Resume Analysis',   style: 'blue'   },
  { text: '🔍 Job Matching',       style: 'green'  },
  { text: '🎤 Interview Prep',     style: 'purple' },
  { text: '🧩 Skill Gap Advice',   style: 'teal'   },
  { text: '✉️ Cover Letter Help',  style: 'yellow' },
  { text: '🚀 Career Strategy',    style: 'red'    },
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
    <Layout title="AI Assistant">
      <SectionHeader icon="🤖" title="AI Assistant" />
      <p style={{ color: '#6f6f6f', marginBottom: '1.25rem', fontSize: '.9rem' }}>
        Chat with your IBM watsonx Orchestrate career agent — ask about your resume,
        job matches, interview prep, or anything career-related.
      </p>

      {/* Capability pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1.5rem' }}>
        {CAPABILITIES.map(({ text, style }) => (
          <Pill key={text} text={text} style={style} />
        ))}
      </div>

      {/* Embedded agent — iframe is the only way to run external JS on Vercel */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
        <iframe
          title="HirePilot AI – watsonx Orchestrate Agent"
          srcDoc={AGENT_HTML}
          style={{ width: '100%', height: 700, border: 'none', display: 'block' }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
        />
      </div>

      {/* Suggested prompts */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '.78rem', fontWeight: 600, color: '#6f6f6f', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.6rem' }}>
          Suggested Prompts
        </div>
        <div className="col-3">
          {PROMPTS.map((p, i) => (
            <div key={i} style={{ background: '#f4f4f4', border: '1px solid #e5e7eb', borderRadius: 4, padding: '.65rem .85rem', fontSize: '.8rem', color: '#161616', lineHeight: 1.4 }}>
              {p}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
