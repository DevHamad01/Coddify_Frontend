import { LegalSection } from '../legal-doc/legal-doc';

export const TERMS_UPDATED = 'November 3, 2026';

export const TERMS_INTRO: readonly string[] = [
  'These Terms of Use ("Terms") are an agreement between you and the Coddify team ("Coddify", "we", "us"). They cover the Coddify website, the learning app and every feature inside it (together, the "Service").',
  'By creating an account or using the Service you agree to these Terms. If you do not agree, please do not use Coddify.',
];

export const TERMS_SECTIONS: readonly LegalSection[] = [
  {
    id: 'service',
    heading: 'What Coddify is',
    paragraphs: [
      'Coddify teaches programming through short lessons, practice problems, interview prep and an AI tutor that gives hints. It started as a Final Year Project built in Pakistan.',
      '**Coddify is free.** There are no subscriptions, paid plans, energy limits or in-app purchases. Store items, titles and tutors are unlocked by learning, never by paying. If that ever changes we will tell you in advance and update these Terms.',
    ],
  },
  {
    id: 'account',
    heading: 'Your account',
    bullets: [
      'You must be **13 or older** to create an account. If you are under 18, use Coddify with the permission of a parent or guardian.',
      'Give accurate details when you register and keep your password private. You are responsible for activity on your account.',
      'One person, one account. Do not share an account or create extra accounts to farm XP, streaks or league places.',
      'You can delete your account at any time from your profile settings or by contacting us.',
    ],
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable use',
    paragraphs: ['Use Coddify to learn and to help others learn. You agree not to:'],
    bullets: [
      'Submit code meant to attack, overload or escape the code runner, or to read data that is not yours.',
      'Post or send anything illegal, hateful, harassing or sexually explicit, including in your username, bio or messages to the AI tutor.',
      'Copy, scrape or republish lessons and problems in bulk, or resell access to the Service.',
      'Cheat leaderboards or missions with scripts, shared answers or multiple accounts.',
      'Try to get around rate limits, security checks or account bans.',
    ],
    after: [
      'We may detect and block abusive behaviour automatically, and we may suspend accounts that break these rules.',
    ],
  },
  {
    id: 'your-code',
    heading: 'Your code and content',
    paragraphs: [
      'Code you write on Coddify stays yours. You give us permission to store it, run it in our sandbox and show it back to you so the Service can work: checking tests, saving your progress and giving tutor hints.',
      'If you make something public, like your profile, showcase or a shared solution, other learners can see it.',
    ],
  },
  {
    id: 'ai-tutor',
    heading: 'The AI tutor',
    paragraphs: [
      'The tutor is an AI model and it can be wrong. Treat its replies as hints, check them by running your code, and do not rely on it for anything outside learning to program.',
      'Messages you send the tutor, together with the exercise and your code, may be processed by our AI provider to produce a reply. Do not put passwords or personal information in tutor messages.',
    ],
  },
  {
    id: 'certificates',
    heading: 'Certificates',
    paragraphs: [
      'Certificates show that a learner completed a Coddify course or learning path. They are not a university degree or an accredited qualification. We may revoke a certificate earned by cheating.',
    ],
  },
  {
    id: 'ownership',
    heading: 'Our content',
    paragraphs: [
      'Lessons, problems, artwork, the Bit mascot, the Coddify name and the app itself belong to Coddify or its content authors. You may use them to learn; you may not copy or redistribute them without our permission. Technology logos belong to their owners.',
    ],
  },
  {
    id: 'availability',
    heading: 'Availability and changes',
    paragraphs: [
      'We work to keep Coddify running, but we cannot promise it will always be available, error free or unchanged. We may add, change or remove features and content at any time.',
    ],
  },
  {
    id: 'termination',
    heading: 'Suspension and termination',
    paragraphs: [
      'We may suspend or close an account that breaks these Terms or puts other learners or the Service at risk. Where reasonable we will tell you why. You can stop using Coddify whenever you like.',
    ],
  },
  {
    id: 'liability',
    heading: 'Disclaimer and liability',
    paragraphs: [
      'Coddify is provided **"as is"** and **"as available"**, without warranties of any kind. As far as the law allows, we are not liable for indirect or consequential losses, or for loss of data, arising from your use of the Service.',
    ],
  },
  {
    id: 'law',
    heading: 'Governing law',
    paragraphs: [
      'These Terms are governed by the laws of Pakistan. Disputes go to the competent courts of Pakistan, unless the law of your country gives you the right to bring them elsewhere.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to these Terms',
    paragraphs: [
      'We may update these Terms. When a change is important we will tell you in the app or by email before it applies. Continuing to use Coddify after that means you accept the new Terms.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact us',
    paragraphs: [
      'Questions about these Terms? Write to **support@coddify.dev** or use the form on our Contact page.',
    ],
  },
];
