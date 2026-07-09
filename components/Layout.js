// HirePilot AI – Shared Layout (Sidebar + main shell)
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV = [
  { href: '/',               icon: '📊', label: 'Dashboard' },
  { href: '/resume',         icon: '📄', label: 'Resume Analyzer' },
  { href: '/jobs',           icon: '🔍', label: 'Job Matcher' },
  { href: '/skills',         icon: '🧩', label: 'Skill Gap Analysis' },
  { href: '/cover-letter',   icon: '✉️', label: 'Cover Letter' },
  { href: '/interview',      icon: '🎤', label: 'Interview Coach' },
  { href: '/tracker',        icon: '📋', label: 'Application Tracker' },
  { href: '/advisor',        icon: '🚀', label: 'AI Career Advisor' },
  { href: '/assistant',      icon: '🤖', label: 'AI Assistant' },
];

export default function Layout({ children, title }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo">✈️</div>
          <h1>HirePilot AI</h1>
          <span>v1.0.0 · IBM watsonx AI</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-item${router.pathname === href ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div className="name">Alex Johnson</div>
          <div className="role">Full Stack Developer · San Francisco, CA</div>
        </div>
        <div className="sidebar-status" style={{ color: '#f1c21b' }}>
          ⬤ Demo Mode
        </div>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed', top: 14, left: 14, zIndex: 200,
          display: 'none', background: '#161616', color: '#fff',
          border: 'none', borderRadius: 4, padding: '6px 10px',
          fontSize: '1.1rem', cursor: 'pointer',
        }}
        className="hamburger"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Main */}
      <main className="main-content">
        {children}
        <footer className="app-footer">
          HirePilot AI v1.0.0 &nbsp;·&nbsp; Powered by IBM watsonx Orchestrate
          &nbsp;·&nbsp; Built with IBM Carbon Design
        </footer>
      </main>

      {/* Floating chat bubble (hidden on /assistant) */}
      {router.pathname !== '/assistant' && <ChatBubble />}

      <style jsx>{`
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

// ── Floating IBM watsonx chat bubble ───────────────────────────
function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const cfg = {
    orchestrationID:    '8254d45b2e8c49f397fed4f4efda4474_82de1835-3f80-482d-864e-7b0c75121f2f',
    hostURL:            'https://au-syd.watson-orchestrate.cloud.ibm.com',
    deploymentPlatform: 'ibmcloud',
    crn:                'crn:v1:bluemix:public:watsonx-orchestrate:au-syd:a/8254d45b2e8c49f397fed4f4efda4474:82de1835-3f80-482d-864e-7b0c75121f2f::',
    agentId:            '066f1a0a-dec9-4dc8-8462-23b617d50639',
    agentEnvironmentId: '6b0c667f-8cb8-43d0-bc81-098baaf81a36',
  };

  // Build the agent iframe HTML
  const iframeDoc = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:#fff;overflow:hidden}
  #root{height:100%;width:100%}
  #root iframe,#root>div{width:100%!important;height:100%!important;border:none!important}
  #ld{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:.75rem;background:#f4f4f4;font-family:sans-serif;
      font-size:.82rem;color:#6f6f6f}
  .sp{width:30px;height:30px;border:3px solid #d0e2ff;border-top-color:#0f62fe;
      border-radius:50%;animation:spin .8s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
</style></head><body>
<div id="root"><div id="ld"><div class="sp"></div><span>Connecting to watsonx…</span></div></div>
<script>
  window.wxOConfiguration={
    orchestrationID:"${cfg.orchestrationID}",
    hostURL:"${cfg.hostURL}",rootElementID:"root",
    deploymentPlatform:"${cfg.deploymentPlatform}",crn:"${cfg.crn}",
    chatOptions:{agentId:"${cfg.agentId}",agentEnvironmentId:"${cfg.agentEnvironmentId}"}
  };
  var s=document.createElement('script');
  s.src="${cfg.hostURL}/wxochat/wxoLoader.js?embed=true";
  s.onload=function(){wxoLoader.init();var l=document.getElementById('ld');if(l)l.remove()};
  s.onerror=function(){var l=document.getElementById('ld');if(l)l.innerHTML='<span>⚠️ Could not load agent</span>'};
  document.head.appendChild(s);
</script></body></html>`;

  return (
    <>
      <button
        className="chat-bubble-btn"
        onClick={() => setOpen(!open)}
        title="Open AI Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28,
          width: 400, height: 580, borderRadius: 8,
          overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.22)',
          zIndex: 9998, display: 'flex', flexDirection: 'column', background: '#fff',
        }}>
          {/* Panel header */}
          <div style={{
            background: 'linear-gradient(135deg,#0f62fe 0%,#001d6c 100%)',
            color: '#fff', padding: '.7rem 1rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'IBM Plex Sans,sans-serif', fontWeight: 600, fontSize: '.9rem',
          }}>
            <span>✈️ HirePilot AI Assistant</span>
            <button onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>
          {/* Agent iframe */}
          <iframe
            title="watsonx-agent"
            srcDoc={iframeDoc}
            style={{ flex: 1, border: 'none', width: '100%' }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      )}
    </>
  );
}
