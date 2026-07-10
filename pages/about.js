import { SectionHeader } from '../components/UI';

export default function About() {
  return (
    <>
      <SectionHeader
        title="About HirePilot AI"
        subtitle="Your AI-powered career companion"
      />

      <div className="card" style={{ padding: '2rem', lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '.95rem' }}>
        <p>
          HirePilot AI is an enterprise-grade career assistant powered by IBM watsonx.ai.
          It helps job seekers and professionals optimize resumes, match with jobs,
          prepare for interviews, and plan long-term career growth.
        </p>
        <p>
          Built with Next.js and the Llama 3.3 70B model, HirePilot delivers
          context-aware, personalized career guidance across every stage of your
          professional journey.
        </p>
        <p>
          <strong>Version:</strong> 2.0<br />
          <strong>Tech Stack:</strong> Next.js, IBM watsonx.ai, Framer Motion<br />
          <strong>Model:</strong> meta-llama/llama-3-3-70b-instruct
        </p>
      </div>
    </>
  );
}
