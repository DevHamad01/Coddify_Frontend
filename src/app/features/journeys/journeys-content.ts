import { TechId } from '../../shared/data/tech';

/** A career path: several courses in the order a job needs them. Starts with its first course. */
export interface CareerPath {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly courses: readonly TechId[];
}

export const CAREER_PATHS: readonly CareerPath[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    summary: 'HTML, CSS, JavaScript, TypeScript, React and Next.js, then real projects.',
    courses: ['html', 'css', 'javascript', 'typescript', 'react', 'nextjs'],
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    summary: 'Python, SQL, Linux, Git and Docker, before any framework.',
    courses: ['python', 'sql', 'linux', 'git', 'docker'],
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    summary: 'Python, Git, SQL, data structures and algorithms, then code others can read.',
    courses: ['python', 'git', 'sql', 'cpp'],
  },
  {
    id: 'full-stack',
    title: 'Full Stack Developer',
    summary: 'The page, the server and the database: JavaScript, React, Node.js and SQL.',
    courses: ['javascript', 'react', 'nodejs', 'sql'],
  },
  {
    id: 'mobile',
    title: 'Mobile App Developer',
    summary: 'Dart and Flutter for Android and iOS, plus Kotlin and Swift basics.',
    courses: ['dart', 'flutter', 'kotlin', 'swift'],
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    summary: 'Linux, Bash, Git, Docker and Kubernetes, in the order the job needs them.',
    courses: ['linux', 'bash', 'git', 'docker', 'kubernetes'],
  },
  {
    id: 'dotnet',
    title: '.NET Developer',
    summary: 'C# from the first line to clean classes, with SQL for the data layer.',
    courses: ['csharp', 'sql', 'git'],
  },
  {
    id: 'systems',
    title: 'Systems Programmer',
    summary: 'C, C++ and Rust: memory, speed and the machine underneath.',
    courses: ['c', 'cpp', 'rust'],
  },
];
