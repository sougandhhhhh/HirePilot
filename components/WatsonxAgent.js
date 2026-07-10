'use client';

import { useEffect, useRef } from 'react';

export default function WatsonxAgent() {
  const containerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

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
      console.warn('[WatsonxAgent] Missing env vars:', missing.join(', '));
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
      rootElementID: 'root',
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
      console.error('[WatsonxAgent] Failed to load wxoLoader script');
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
  }, []);

  return <div id="root" ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 660 }} />;
}