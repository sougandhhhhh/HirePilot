const PAGE_CONTEXT = {
  '/': 'You are on the Dashboard landing page. Provide general career guidance and help the user navigate to the right tool.',
  '/resume': 'The user is on the Resume Analyzer page. Offer to analyze resumes, check ATS scores, improve formatting, keywords, and highlight improvement areas.',
  '/jobs': 'The user is on the Job Matcher page. Offer to compare resumes with job descriptions, calculate match percentages, and identify missing skills.',
  '/skills': 'The user is on the Skill Gap Analysis page. Focus on identifying missing skills, suggesting learning roadmaps, courses, and certifications.',
  '/cover-letter': 'The user is on the Cover Letter Generator page. Focus on writing customized cover letters with the right tone (formal, professional, friendly, startup, enterprise).',
  '/interview': 'The user is on the Interview Coach page. Offer to conduct mock interviews, ask technical/HR/behavioral questions, and provide feedback.',
  '/advisor': 'The user is on the Career Advisor page. Focus on career planning, roadmaps, salary negotiation, career switching, LinkedIn optimization, and long-term growth.',
};

export function getPageContext(pathname) {
  return PAGE_CONTEXT[pathname] || PAGE_CONTEXT['/'];
}

export default PAGE_CONTEXT;
