import { LegalSection } from '../legal-doc/legal-doc';

export const PRIVACY_UPDATED = 'November 3, 2026';

export const PRIVACY_INTRO: readonly string[] = [
  'This Privacy Policy explains what information Coddify collects when you use the website and the learning app, why we need it, who we share it with and the choices you have.',
  'The short version: we collect only what we need to teach you, we never sell your data and we do not show ads.',
];

export const PRIVACY_SECTIONS: readonly LegalSection[] = [
  {
    id: 'collect',
    heading: 'What we collect and why',
    table: [
      ['When', 'What we collect', 'Why'],
      [
        'You create an account',
        'Name, email address, username and a hashed password (never the password itself). With Google sign-in: your name, email and profile picture from Google.',
        'To create your account, sign you in and contact you about it.',
      ],
      [
        'You complete onboarding',
        'Your goal, experience level, chosen language and daily goal.',
        'To recommend a course and set your journey.',
      ],
      [
        'You learn and practise',
        'Lessons completed, code you run or submit, test results, XP, streaks, missions and league results.',
        'To save your progress, check your answers and run gamification.',
      ],
      [
        'You ask the AI tutor',
        'Your message, the current exercise and your code.',
        'To generate a helpful hint.',
      ],
      [
        'You customise your profile',
        'Avatar, bio, title, showcase and equipped items.',
        'To show your profile to you and other learners.',
      ],
      [
        'You contact us',
        'Your name, email and message.',
        'To answer you.',
      ],
      [
        'You use the app',
        'Basic technical data: IP address, browser, device type and error logs.',
        'To keep the Service secure, limit abuse and fix bugs.',
      ],
    ],
    after: ['Creating an account is optional, but most of Coddify needs one to save your progress.'],
  },
  {
    id: 'sharing',
    heading: 'Who we share it with',
    paragraphs: ['We do not sell or rent your personal data. We share it only in these cases:'],
    bullets: [
      '**Other learners** see your public profile: username, display name, avatar, level, badges, showcase and leaderboard position.',
      '**Service providers** who help us run Coddify, such as our hosting, email delivery and code execution providers, only for that purpose.',
      '**Our AI provider** processes tutor messages, the exercise and your code to produce a reply. It is not used to identify you.',
      '**Google**, if you choose to sign in with Google.',
      '**Authorities**, when the law requires it or to protect learners and the Service.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies and local storage',
    paragraphs: [
      'Coddify uses your browser storage for things that make the app work: keeping you signed in, remembering your theme, editor theme and unfinished code. We do not use advertising or cross-site tracking cookies.',
    ],
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    paragraphs: [
      'We keep your account data while your account is open. When you delete your account we remove your personal data within 30 days, except what we must keep for security or legal reasons. Anonymous statistics, like how many learners finished a lesson, may be kept.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    paragraphs: [
      'Passwords are hashed with a slow, salted algorithm. Connections are encrypted, sign-in tokens expire and code runs in an isolated sandbox. No system is perfectly secure, so please use a strong, unique password.',
    ],
  },
  {
    id: 'rights',
    heading: 'Your rights',
    paragraphs: ['Wherever you live, you can ask us to:'],
    bullets: [
      '**Access** the personal data we hold about you and get a copy of it.',
      '**Correct** details that are wrong. Most can be edited in your profile.',
      '**Delete** your account and personal data.',
      '**Object** to or limit how we use your data, and withdraw consent you gave earlier.',
    ],
    after: [
      'Email **privacy@coddify.dev** to use any of these rights. We may ask you to confirm it is your account first, and we answer within 30 days.',
    ],
  },
  {
    id: 'children',
    heading: 'Children',
    paragraphs: [
      'Coddify is not for children under 13, and we do not knowingly collect their data. If you think a child under 13 has an account, contact us and we will delete it.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    paragraphs: [
      'If we change this policy in a way that matters, we will tell you in the app or by email before the change applies. The date at the top shows the latest version.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact us',
    paragraphs: [
      'Questions or concerns about your privacy? Write to **privacy@coddify.dev** or use the form on our Contact page.',
    ],
  },
];
