import { SectionHeader } from '../components/UI';

export default function Terms() {
  return (
    <>
      <SectionHeader
        title="Terms of Service"
        subtitle="Guidelines for using HirePilot AI"
      />

      <div className="card" style={{ padding: '2rem', lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '.95rem' }}>
        <p>
          HirePilot AI is provided as a career assistance tool. It is not a
          substitute for professional career advice, legal counsel, or
          financial planning.
        </p>
        <p>
          All AI-generated content — including resume analysis, interview
          questions, cover letters, and career recommendations — should be
          reviewed by the user before use. The tool may occasionally produce
          inaccurate or incomplete information.
        </p>
        <p>
          By using this service, you agree that:
        </p>
        <ul>
          <li>You will not rely solely on AI-generated output for career decisions.</li>
          <li>You will not submit sensitive personal data beyond what is necessary.</li>
          <li>The maintainers are not liable for outcomes resulting from tool usage.</li>
        </ul>
        <p>
          HirePilot AI is provided "as is" without warranty of any kind.
        </p>
      </div>
    </>
  );
}
