'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const API_BASE = '';

export default function ChatWindow({ isFloating, pageContext, currentPage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const contextToUse = pageContext || 'You are on the Dashboard landing page. Provide general career guidance and help the user navigate to the right tool.';

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);

    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            { role: 'system', content: contextToUse },
            ...updated
          ]
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const headerHeight = isFloating ? 0 : 60;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', width: '100%',
      background: 'var(--bg-deep)',
      fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: isFloating ? '1rem' : '1.5rem 1.5rem 0',
        display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '2rem',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '.5rem' }}>
              HirePilot AI Assistant
            </h2>
            <p style={{ fontSize: '.85rem', maxWidth: 400, lineHeight: 1.7 }}>
              Ask me anything about your career — resume analysis, interview prep, skill gaps, job matching, and more.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'fadeIn .25s ease',
          }}>
            <div style={{
              maxWidth: isFloating ? '80%' : '75%',
              padding: '.75rem 1rem',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'var(--ibm-blue)'
                : 'var(--glass-bg)',
              border: msg.role === 'user'
                ? 'none'
                : '1px solid var(--glass-border)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              fontSize: '.875rem',
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '.75rem 1rem',
              borderRadius: '16px 16px 16px 4px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-muted)',
              fontSize: '.85rem',
              display: 'flex', alignItems: 'center', gap: '.4rem',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.2s infinite', display: 'inline-block' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.2s infinite .2s', display: 'inline-block' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.2s infinite .4s', display: 'inline-block' }} />
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '.75rem 1rem', borderRadius: 12,
            background: 'var(--red-soft)',
            border: '1px solid var(--red)',
            color: 'var(--red)', fontSize: '.82rem',
            textAlign: 'center',
          }}>
            {error === 'Failed to fetch' ? 'Cannot reach the AI assistant. Ensure WATSONX_API_KEY, WATSONX_PROJECT_ID, and WATSONX_URL are set in Vercel Environment Variables and redeploy.' : error}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid var(--glass-border)',
        padding: isFloating ? '.75rem' : '1rem 1.5rem',
        background: 'var(--bg-card)',
      }}>
        <div style={{
          display: 'flex', gap: '.5rem',
          alignItems: 'flex-end',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your career..."
            rows={1}
            style={{
              flex: 1,
              padding: '.65rem .85rem',
              borderRadius: 12,
              border: '1px solid var(--glass-border)',
              background: 'var(--bg-deep)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '.85rem',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.4,
              minHeight: 42,
              maxHeight: 120,
            }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42,
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, var(--ibm-blue), var(--cyan-dim))',
              color: '#fff',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? .45 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
              flexShrink: 0,
              transition: 'opacity .15s',
            }}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}
