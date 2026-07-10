// HirePilot AI – Premium Layout (Collapsible floating sidebar + top navbar)
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV = [
  { href: '/',             icon: '▦',  label: 'Dashboard',           svg: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { href: '/resume',       icon: '◱',  label: 'Resume Analyzer' },
  { href: '/jobs',         icon: '◉',  label: 'Job Matcher' },
  { href: '/skills',       icon: '◈',  label: 'Skill Gap Analysis' },
  { href: '/cover-letter', icon: '◧',  label: 'Cover Letter' },
  { href: '/interview',    icon: '◎',  label: 'Interview Coach' },
  { href: '/tracker',      icon: '▦',  label: 'Application Tracker' },
  { href: '/advisor',      icon: '◈',  label: 'AI Career Advisor' },
  { href: '/assistant',    icon: '◉',  label: 'AI Assistant' },
];

const NAV_ICONS = {
  '/':             () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
  '/resume':       () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>,
  '/jobs':         () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.48 0 12.36 0c-1.31 0-2.51.54-3.38 1.42L8 3l-.98-.58C6.14.54 4.94 0 3.64 0 .52 0-2 2.53-2 4.64c0 .48.11.92.18 1.36H-2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>,
  '/jobs2':        () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>,
  '/skills':       () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
  '/cover-letter': () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  '/interview':    () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>,
  '/tracker':      () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>,
  '/advisor':      () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg>,
  '/assistant':    () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>,
};

export default function Layout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); }, [router.pathname]);

  const sidebarClass = [
    'sidebar',
    collapsed ? 'collapsed' : '',
    mobileOpen ? 'open' : '',
  ].filter(Boolean).join(' ');

  const mainClass = [
    'main-content',
    collapsed ? 'sidebar-collapsed' : '',
  ].filter(Boolean).join(' ');

  const navbarClass = [
    'top-navbar',
    collapsed ? 'sidebar-collapsed' : '',
  ].filter(Boolean).join(' ');

  if (!mounted) return null;

  return (
    <div className="app-shell">
      {/* ── Sidebar ────────────────────────────────── */}
      <aside className={sidebarClass} aria-label="Main navigation">
        {/* Brand */}
        <div className="sidebar-brand">
          <img src="/logo.png" alt="HirePilot AI Logo" className="logo-image" />
          <div className="brand-text">
            <h1>HirePilot AI</h1>
            <span>IBM watsonx Orchestrate</span>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '›' : '‹'}
        </button>

        {/* Nav */}
        <nav className="sidebar-nav" role="navigation">
          <div className="nav-section-label">Navigation</div>
          {NAV.map(({ href, label }) => {
            const IconComp = NAV_ICONS[href] || (() => <span>●</span>);
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`nav-item${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? label : undefined}
              >
                <span className="nav-icon" aria-hidden="true">
                  <IconComp />
                </span>
                <span className="nav-label">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="sidebar-profile">
          <div className="sidebar-avatar" aria-hidden="true">AJ</div>
          <div className="profile-info">
            <div className="name">Alex Johnson</div>
            <div className="role">Full Stack Dev · SF</div>
          </div>
        </div>

        <div className="sidebar-status">
          <div className="status-dot" aria-hidden="true" />
          <span>Demo Mode · watsonx Active</span>
        </div>
      </aside>

      {/* ── Mobile overlay ─────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 199,
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Top Navbar ─────────────────────────────── */}
      <header className={navbarClass} role="banner">
        {/* Mobile hamburger */}
        <button
          className="nav-btn hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none' }}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Search */}
        <div className="nav-search" role="search">
          <span className="nav-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search anything…"
            aria-label="Search"
          />
        </div>

        <div className="nav-actions">
          {/* Upload resume */}
          <button className="nav-btn-primary nav-btn" title="Upload Resume">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            <span style={{ fontSize: '.75rem', fontWeight: 600 }}>Upload</span>
          </button>

          {/* Notifications */}
          <button className="nav-btn" title="Notifications" aria-label="Notifications">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span className="notification-badge" aria-label="3 notifications" />
          </button>

          {/* Quick AI */}
          <Link href="/assistant" className="nav-btn" title="AI Assistant" style={{ textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </Link>

          {/* Settings */}
          <button className="nav-btn" title="Settings" aria-label="Settings">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>

          {/* Avatar */}
          <div className="nav-avatar" title="Profile" role="button" tabIndex={0}>
            AJ
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────── */}
      <main className={mainClass} id="main-content">
        <div className="page-content">
          {children}
        </div>
        <footer className="app-footer">
          HirePilot AI v2.0 &nbsp;·&nbsp;
          Powered by <a href="https://www.ibm.com/products/watsonx-orchestrate" target="_blank" rel="noreferrer">IBM watsonx Orchestrate</a>
          &nbsp;·&nbsp; Built with IBM Carbon Design System
        </footer>
      </main>

      {/* ── Floating chat bubble (hidden on /assistant) ── */}
      {router.pathname !== '/assistant' && <ChatBubble />}

      <style jsx>{`
        .logo-image {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          object-fit: cover;
        }
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

// ── Premium Floating IBM watsonx Chat Panel ──────────────────
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

  const iframeDoc = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:#0B1120;overflow:hidden}
  #root{height:100%;width:100%}
  #root iframe,#root>div{width:100%!important;height:100%!important;border:none!important}
  #ld{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:.75rem;background:#0B1120;font-family:'IBM Plex Sans',sans-serif;
      font-size:.82rem;color:#94a3b8}
  .sp{width:32px;height:32px;border:3px solid rgba(15,98,254,0.2);border-top-color:#0f62fe;
      border-radius:50%;animation:spin .7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .brand{font-size:.9rem;font-weight:700;color:#f0f6ff;margin-bottom:.25rem}
</style></head><body>
<div id="root">
  <div id="ld">
    <div class="brand"><img src="/logo.png" alt="HirePilot AI" style="width: 24px; height: 24px; border-radius: 4px;" /> HirePilot AI</div>
    <div class="sp"></div>
    <span>Connecting to watsonx…</span>
  </div>
</div>
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
  s.onerror=function(){var l=document.getElementById('ld');if(l)l.innerHTML='<span style="color:#f87171">⚠ Could not connect to agent</span>'};
  document.head.appendChild(s);
</script></body></html>`;

  return (
    <>
      <button
        className="chat-bubble-btn"
        onClick={() => { setOpen(!open); if (!loaded) setLoaded(true); }}
        title="Open AI Assistant"
        aria-label={open ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-expanded={open}
      >
        {open ? '✕' : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="HirePilot AI Assistant"
          style={{
            position: 'fixed', bottom: 100, right: 28,
            width: 420, height: 600,
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(15,98,254,0.2), 0 0 40px rgba(15,98,254,0.15)',
            zIndex: 9998,
            display: 'flex', flexDirection: 'column',
            background: '#0B1120',
            animation: 'scaleIn .25s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Panel header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15,98,254,0.9) 0%, rgba(6,182,212,0.7) 100%)',
            backdropFilter: 'blur(12px)',
            color: '#fff', padding: '.75rem 1rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'IBM Plex Sans,sans-serif', fontWeight: 600, fontSize: '.88rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <img src="/logo.png" alt="HirePilot AI" style={{
                width: 28, height: 28,
                borderRadius: 8,
                objectFit: 'cover',
              }} />
              <div>
                <div style={{ fontSize: '.85rem', fontWeight: 700 }}>HirePilot AI Assistant</div>
                <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
                  IBM watsonx Orchestrate · Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                cursor: 'pointer', fontSize: '.85rem', borderRadius: 8,
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>

          {/* Agent iframe */}
          {loaded && (
            <iframe
              title="watsonx-agent"
              srcDoc={iframeDoc}
              style={{ flex: 1, border: 'none', width: '100%' }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation allow-storage-access-by-user-activation allow-popups-to-escape-sandbox"
            />
          )}
        </div>
      )}
    </>
  );
}
