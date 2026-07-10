'use client';

import { useEffect, useRef } from 'react';

export default function WatsonxAgent() {
  const containerRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const config = {
      orchestrationID: process.env.NEXT_PUBLIC_WX_ORCHESTRATION_ID,
      hostURL: process.env.NEXT_PUBLIC_WX_HOST_URL,
      crn: process.env.NEXT_PUBLIC_WX_CRN,
      agentID: process.env.NEXT_PUBLIC_WX_AGENT_ID,
      agentEnvID: process.env.NEXT_PUBLIC_WX_AGENT_ENV_ID,
      root: '#root',
    };

    const missingKeys = Object.entries(config).filter(([k, v]) => k !== 'root' && !v).map(([k]) => k);
    if (missingKeys.length > 0) {
      console.warn('[WatsonxAgent] Missing config:', missingKeys.join(', '));
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
    script.src = 'https://cdn.watson-orchestrate.ibm.com/embedded-chat/loader.js';
    script.async = true;
    script.onload = () => {
      if (window.wxoLoader && containerRef.current) {
        window.wxoLoader(config);
      }
    };
    script.onerror = () => {
      console.error('[WatsonxAgent] Failed to load wxoLoader script');
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
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.wxoLoader && window.wxoLoader.destroy) {
        window.wxoLoader.destroy();
      }
    };
  }, []);

  return <div id="root" ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 660 }} />;
}