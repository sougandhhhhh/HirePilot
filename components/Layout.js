// HirePilot AI – Premium Layout (Collapsible floating sidebar + top navbar)
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV = [
  { href: '/',             icon: '▦',  label: 'Home',           svg: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
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
  const [theme, setTheme] = useState('dark');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); }, [router.pathname]);
  useEffect(() => {
    if (theme === 'light') {
      document.body.style.background = '#f5f5f5';
      document.body.style.color = '#1a1a1a';
    } else {
      document.body.style.background = '#0B1120';
      document.body.style.color = '#f0f6ff';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

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
            <span>AI-Powered Career Tools</span>
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

        <div className="nav-actions">
          {/* Theme Toggle */}
          <button 
            className="nav-btn" 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} 
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
            )}
          </button>

          {/* Settings */}
          <button 
            className="nav-btn" 
            title="Settings" 
            aria-label="Settings"
            onClick={toggleSettings}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Main content ───────────────────────────── */}
      <main className={mainClass} id="main-content">
        <div className="page-content">
          {children}
        </div>
        <footer className="app-footer">
          HirePilot AI v2.0 &nbsp;·&nbsp;
          AI-Powered Career Tools
          &nbsp;·&nbsp; Built with Modern Design System
        </footer>
      </main>

      {/* ── Floating chat bubble (hidden on /assistant) ── */}
      {router.pathname !== '/assistant' && <ChatBubble />}

      {/* ── Settings Panel ── */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 60,
          right: 20,
          width: 300,
          background: theme === 'dark' ? '#1e293b' : '#ffffff',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: 12,
          padding: '1.5rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Settings</h3>
            <button 
              onClick={toggleSettings}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: theme === 'dark' ? '#fff' : '#000' }}
            >
              ×
            </button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Theme</label>
            <button 
              onClick={toggleTheme}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: theme === 'dark' ? '#0F62FE' : '#f5f5f5',
                border: 'none',
                borderRadius: 8,
                color: theme === 'dark' ? '#fff' : '#000',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
          <div style={{ fontSize: '0.8rem', color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
            HirePilot AI v2.0
          </div>
        </div>
      )}

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

// ── Premium Floating AI Chat Panel ──────────────────
function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!loaded || scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const config = {
      orchestrationID: process.env.NEXT_PUBLIC_WX_ORCHESTRATION_ID,
      hostURL: process.env.NEXT_PUBLIC_WX_HOST_URL,
      crn: process.env.NEXT_PUBLIC_WX_CRN,
      agentID: process.env.NEXT_PUBLIC_WX_AGENT_ID,
      agentEnvID: process.env.NEXT_PUBLIC_WX_AGENT_ENV_ID,
      root: '#chat-root',
    };

    const missingKeys = Object.entries(config).filter(([k, v]) => k !== 'root' && !v).map(([k]) => k);
    if (missingKeys.length > 0) {
      console.warn('[ChatBubble] Missing config:', missingKeys.join(', '));
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-family:system-ui;">
            <div style="text-align:center;padding:2rem;">
              <div style="font-size:2rem;margin-bottom:0.5rem;">⚙</div>
              <div style="font-weight:600;margin-bottom:0.25rem;">AI Assistant Not Configured</div>
              <div style="font-size:0.85rem;color:#666;">Missing: ${missingKeys.join(', ')}</div>
              <div style="font-size:0.75rem;color:#555;margin-top:1rem;">Add env vars to .env.local and restart dev server</div>
            </div>
          </div>
        `;
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://au-syd.watson-orchestrate.cloud.ibm.com/wxochat/wxoLoader.js?embed=true';
    script.async = true;
    script.onload = () => {
      if (window.wxoLoader && containerRef.current) {
        window.wxoLoader(config);
      }
    };
    script.onerror = () => {
      console.error('[ChatBubble] Failed to load wxoLoader script');
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f88;font-family:system-ui;">
            <div style="text-align:center;padding:2rem;">
              <div style="font-size:2rem;margin-bottom:0.5rem;">⚠</div>
              <div style="font-weight:600;margin-bottom:0.25rem;">Failed to Load AI Agent</div>
              <div style="font-size:0.85rem;color:#888;">Could not load watsonx Orchestrate script</div>
            </div>
          </div>
        `;
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (window.wxoLoader && window.wxoLoader.destroy) {
        window.wxoLoader.destroy();
      }
    };
  }, [loaded]);

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
                  AI-Powered · Online
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

          {/* Agent container */}
          <div
            ref={containerRef}
            id="chat-root"
            style={{ flex: 1, width: '100%', minHeight: 0 }}
          >
            {!loaded && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100%', gap: '.75rem',
                background: '#0B1120', fontFamily: 'system-ui', fontSize: '.82rem', color: '#94a3b8'
              }}>
                <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#f0f6ff' }}>
                  <img src="/logo.png" alt="HirePilot AI" style={{ width: 24, height: 24, borderRadius: 4, verticalAlign: 'middle', marginRight: '.5rem' }} /> HirePilot AI
                </div>
                <div className="spinner" style={{
                  width: 32, height: 32, border: '3px solid rgba(15,98,254,0.2)', borderTopColor: '#0f62fe',
                  borderRadius: '50%', animation: 'spin .7s linear infinite'
                }} />
                <span>Connecting to AI Assistant…</span>
                <style jsx>{`
                  @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
