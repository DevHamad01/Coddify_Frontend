import { TechCategory, TechId } from '../../shared/data/tech';
import { AccordionItem } from '../../shared/ui/accordion/accordion';
import { IconName } from '../../shared/ui/icon/icons';

/** One-line description of a course certificate, by the course's main category. */
export const CATEGORY_BLURB: Readonly<Record<TechCategory, string>> = {
  popular: 'Core syntax, problem solving and a final project.',
  web: 'Build and ship pages and apps for the browser.',
  languages: 'From first variable to clean, tested code.',
  systems: 'Memory, performance and how machines run code.',
  mobile: 'Screens, state and apps for phones.',
  data: 'Query, clean and analyse real data.',
  tools: 'The everyday tools of working developers.',
};

export interface PathCertificate {
  readonly title: string;
  readonly summary: string;
  readonly techs: readonly TechId[];
}

/** A path certificate is earned by finishing every course in the path. */
export const PATH_CERTIFICATES: readonly PathCertificate[] = [
  {
    title: 'Software Engineer',
    summary: 'Python, Git, SQL and data structures, then code others can read.',
    techs: ['python', 'git', 'sql', 'linux'],
  },
  {
    title: 'Full Stack Web Developer',
    summary: 'HTML, CSS and JavaScript up to React and Node.',
    techs: ['html', 'css', 'javascript', 'react', 'nodejs'],
  },
  {
    title: 'Frontend Developer',
    summary: 'Responsive pages, TypeScript and a modern framework.',
    techs: ['html', 'css', 'typescript', 'angular'],
  },
  {
    title: 'Backend Developer',
    summary: 'APIs, databases and deploying your server.',
    techs: ['csharp', 'sql', 'docker'],
  },
  {
    title: 'Data Analyst',
    summary: 'Python and SQL to clean, query and explain data.',
    techs: ['python', 'sql'],
  },
  {
    title: 'Mobile App Developer',
    summary: 'Cross-platform apps with Dart and Flutter.',
    techs: ['dart', 'flutter', 'kotlin'],
  },
];

export const STEPS: readonly { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'compass',
    title: 'Pick a course',
    body: 'Choose a language or a career path. Every course on Coddify comes with its own certificate.',
  },
  {
    icon: 'code',
    title: 'Code through it',
    body: 'Finish the lessons and challenges in each section. Every challenge runs real code and checks it with tests.',
  },
  {
    icon: 'award',
    title: 'Earn and share',
    body: 'Complete the course to get a certificate with a unique ID. Add it to LinkedIn or your CV in one click.',
  },
];

export const INCLUDED: readonly string[] = [
  'Your full name and the course you completed',
  'The date it was issued and a unique certificate ID',
  'A public link anyone can use to verify it',
  'A high quality PDF you can download or print',
  'One-click "Add to LinkedIn"',
];

export const CERTIFICATE_FAQ: readonly AccordionItem[] = [
  {
    question: 'How do I earn a Coddify certificate?',
    answer:
      'Finish every section of a course, including its challenges. The certificate appears in your profile as soon as the last section is done.',
  },
  {
    question: 'Are the certificates really free?',
    answer:
      'Yes. Coddify is completely free, and so is every certificate. There is nothing to buy and no paid tier.',
  },
  {
    question: 'How can someone check that my certificate is real?',
    answer:
      'Every certificate has a unique ID and a public link. An employer can open the link, or enter the ID in the verify box on this page, to see who earned it and when.',
  },
  {
    question: 'Can I add it to LinkedIn?',
    answer:
      'Yes. Each certificate has an "Add to LinkedIn" button that fills in the name, issuer, date and verification link for you.',
  },
  {
    question: 'How long does it take to earn one?',
    answer:
      'It depends on the course and your pace. With one or two lessons a day, most beginner courses take a few weeks.',
  },
  {
    question: 'Is a Coddify certificate an accredited qualification?',
    answer:
      'No. It shows that you completed hands-on coursework on Coddify. It is great proof of practice for a CV or internship application, but it is not a university degree.',
  },
  {
    question: 'I lost my certificate ID. What should I do?',
    answer:
      'Every certificate you earn is listed in your profile with its ID and link, so you can copy it again at any time.',
  },
];
