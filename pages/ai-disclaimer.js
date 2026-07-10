import { SectionHeader } from '../components/UI';

export default function AIDisclaimer() {
  return (
    <>
      <SectionHeader
        title="AI Disclaimer"
        subtitle="Understanding AI-generated content"
      />

      <div className="card" style={{ padding: '2rem', lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '.95rem' }}>
        <p>
          HirePilot AI uses IBM watsonx.ai (Llama 3.3 70B) to generate responses.
          While the model is powerful, it may occasionally produce incorrect,
          misleading, or incomplete information.
        </p>
        <p>
          <strong>Important notes:</strong>
        </p>
        <ul>
          <li>AI-generated resume scores and job match percentages are estimates, not guarantees.</li>
          <li>Interview questions may not cover all possible topics for a specific role.</li>
          <li>Salary estimates are based on general market data and may not reflect your specific situation.</li>
          <li>Cover letters should be reviewed and personalized before submission.</li>
          <li>Career advice is informational and not a substitute for professional guidance.</li>
        </ul>
        <p>
          Always verify critical information from multiple sources. You are
          responsible for decisions made based on AI-generated content.
        </p>
        <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '.85rem' }}>
          Last updated: July 2026
        </p>
      </div>
    </>
  );
}
