// HirePilot AI – Premium Layout (Collapsible floating sidebar + top navbar)
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeDropdown from './theme/ThemeDropdown';
import { useTheme } from './theme/ThemeContext';

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
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const { theme, setTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); }, [router.pathname]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hirepilot-font-size');
      if (saved) setFontSize(parseInt(saved, 10));
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    try { localStorage.setItem('hirepilot-font-size', String(fontSize)); } catch {}
  }, [fontSize]);

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

  // navbarClass removed - top navbar bar eliminated

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

        {/* Collapse toggle at bottom */}
        <div style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--glass-border)',
          padding: collapsed ? '.75rem 0' : '.75rem 1rem',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
        }}>
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
            style={{
              position: 'static',
              width: 28,
              height: 28,
              fontSize: '.75rem',
            }}
          >
            {collapsed ? '›' : '‹'}
          </button>
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

      {/* ── Floating top-right actions ──────────────── */}
      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        display: 'flex',
        gap: '.4rem',
        zIndex: 250,
      }}>
        {/* Mobile hamburger */}
        <button
          className="nav-btn hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Theme Toggle */}
        <ThemeDropdown />

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
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: 12,
          padding: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Settings</h3>
            <button 
              onClick={toggleSettings}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
            >
              ×
            </button>
          </div>

          {/* Theme */}
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Theme</label>
            <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
              {[
                { id: 'light', label: '☀ Light' },
                { id: 'dark', label: '🌙 Dark' },
                { id: 'system', label: '💻 System' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  style={{
                    flex: 1, minWidth: 70,
                    padding: '.45rem .5rem',
                    borderRadius: 8,
                    border: theme === opt.id ? '1px solid var(--ibm-blue)' : '1px solid var(--glass-border)',
                    background: theme === opt.id ? 'var(--ibm-blue-soft)' : 'transparent',
                    color: theme === opt.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '.78rem',
                    fontWeight: theme === opt.id ? 600 : 400,
                    fontFamily: 'inherit',
                    transition: 'all .15s ease',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Size */}
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Text Size</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <button
                onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                disabled={fontSize <= 80}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: '1px solid var(--glass-border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: fontSize <= 80 ? 0.4 : 1,
                }}
              >A−</button>
              <div style={{
                flex: 1, textAlign: 'center',
                fontSize: '0.85rem', fontWeight: 600,
                color: 'var(--text-primary)',
              }}>{fontSize}%</div>
              <button
                onClick={() => setFontSize(Math.min(140, fontSize + 10))}
                disabled={fontSize >= 140}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: '1px solid var(--glass-border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: fontSize >= 140 ? 0.4 : 1,
                }}
              >A+</button>
              <button
                onClick={() => setFontSize(100)}
                style={{
                  padding: '.3rem .6rem', borderRadius: 8,
                  border: '1px solid var(--glass-border)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '.7rem',
                }}
              >Reset</button>
            </div>
          </div>

          {/* Clear Cache */}
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
            <button
              onClick={() => {
                if (window.confirm('Clear local cache and reload?')) {
                  try { localStorage.clear(); } catch {}
                  window.location.reload();
                }
              }}
              style={{
                width: '100%',
                padding: '.5rem .75rem',
                borderRadius: 8,
                border: '1px solid var(--glass-border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '.82rem',
                textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '.5rem',
                transition: 'all .15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              <span style={{ fontSize: '1rem' }}>🗑</span>
              Clear Local Cache
            </button>
          </div>

          {/* About */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>About</label>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div><strong style={{ color: 'var(--text-secondary)' }}>HirePilot AI</strong> v2.0</div>
              <div>AI-Powered Career Tools</div>
              <div style={{ marginTop: '.35rem', fontSize: '.72rem' }}>
                Built with Next.js &middot; IBM watsonx<br />
                Premium Design System 2026
              </div>
            </div>
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
        .hamburger-btn { display: none; }
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

    const hostURL = process.env.NEXT_PUBLIC_WX_HOST_URL;
    const orchestrationID = process.env.NEXT_PUBLIC_WX_ORCHESTRATION_ID;
    const crn = process.env.NEXT_PUBLIC_WX_CRN;
    const agentId = process.env.NEXT_PUBLIC_WX_AGENT_ID;
    const agentEnvId = process.env.NEXT_PUBLIC_WX_AGENT_ENV_ID;

    const missing = [];
    if (!orchestrationID) missing.push('NEXT_PUBLIC_WX_ORCHESTRATION_ID');
    if (!hostURL) missing.push('NEXT_PUBLIC_WX_HOST_URL');
    if (!crn) missing.push('NEXT_PUBLIC_WX_CRN');
    if (!agentId) missing.push('NEXT_PUBLIC_WX_AGENT_ID');
    if (!agentEnvId) missing.push('NEXT_PUBLIC_WX_AGENT_ENV_ID');

    if (missing.length > 0) {
      console.warn('[ChatBubble] Missing env vars:', missing.join(', '));
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-family:system-ui;">
            <div style="text-align:center;padding:2rem;">
              <div style="font-size:2rem;margin-bottom:0.5rem;">&#9881;</div>
              <div style="font-weight:600;margin-bottom:0.25rem;">AI Assistant Not Configured</div>
              <div style="font-size:0.85rem;color:#666;">Missing: ${missing.join(', ')}</div>
              <div style="font-size:0.75rem;color:#555;margin-top:1rem;">Add env vars and redeploy</div>
            </div>
          </div>
        `;
      }
      return;
    }

    window.wxOConfiguration = {
      orchestrationID,
      hostURL,
      rootElementID: 'chat-root',
      deploymentPlatform: 'ibmcloud',
      crn,
      chatOptions: {
        agentId,
        agentEnvironmentId: agentEnvId,
      },
    };

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = `${hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.async = true;
    script.onload = () => {
      if (window.wxoLoader) {
        window.wxoLoader.init();
      }
    };
    script.onerror = () => {
      console.error('[ChatBubble] Failed to load wxoLoader script');
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f88;font-family:system-ui;">
            <div style="text-align:center;padding:2rem;">
              <div style="font-size:2rem;margin-bottom:0.5rem;">&#9888;</div>
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
