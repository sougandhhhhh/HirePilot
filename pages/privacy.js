import { SectionHeader } from '../components/UI';

export default function Privacy() {
  return (
    <>
      <SectionHeader
        title="Privacy Policy"
        subtitle="How we handle your data"
      />

      <div className="card" style={{ padding: '2rem', lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '.95rem' }}>
        <p>
          HirePilot AI does not store, share, or sell your personal information.
          Conversations with the AI assistant are processed in real time via
          IBM watsonx.ai and are not permanently logged.
        </p>
        <p>
          Resume content, job descriptions, and chat messages are used solely
          to generate responses and are discarded after the session ends.
        </p>
        <p>
          We use local storage only for theme preferences and font size settings.
          No cookies are used for tracking or advertising purposes.
        </p>
        <p>
          By using HirePilot AI, you agree to this privacy policy. If you have
          questions, contact the repository owner.
        </p>
      </div>
    </>
  );
}
