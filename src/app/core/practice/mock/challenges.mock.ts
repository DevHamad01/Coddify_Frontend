import { CHALLENGE_LANGUAGES, Challenge, Difficulty } from '../practice.models';

/**
 * The free challenge bank: short story-style problems, each written for one language.
 * Mock until the admin panel can author challenges.
 */
const TITLES: readonly (readonly [string, Difficulty])[] = [
  ["Duplicate Characters Until 'x'", 'Easy'],
  ['Counting Trees on a Hiking Trail', 'Easy'],
  ['Swap First and Last Characters', 'Beginner'],
  ['Forest Trail Name Generator', 'Easy'],
  ['Watering Plants Based on Temperature', 'Beginner'],
  ['Museum Artifact Locator', 'Easy'],
  ['Sunshine Plant Code Converter', 'Easy'],
  ['Secret Message Encryption', 'Medium'],
  ['Animal Name Match', 'Beginner'],
  ['Shortening Book Titles', 'Easy'],
  ['Echoing Words', 'Beginner'],
  ['Counting Gallops on a Riding Path', 'Easy'],
  ['Microscopic Segment Reversal', 'Medium'],
  ['Sorting Bird Sightings', 'Easy'],
  ['Glowing Flowers in the Secret Garden', 'Easy'],
  ['Organism Growth Simulation', 'Medium'],
  ['Shade Word Reversal', 'Beginner'],
  ['Tune the French Horns', 'Easy'],
  ['Find Special Numbers', 'Easy'],
  ['Reversing Seashells Under the Moonlight', 'Beginner'],
  ['Cricket Score Board', 'Easy'],
  ['Chai Order Counter', 'Beginner'],
  ['Rickshaw Fare Calculator', 'Easy'],
  ['Mango Basket Balancer', 'Medium'],
  ['Kite Festival Leaderboard', 'Medium'],
  ['Library Late Fees', 'Easy'],
  ['Train Platform Scheduler', 'Hard'],
  ['Weather Streak Finder', 'Medium'],
  ['Spice Market Inventory', 'Easy'],
  ['Bus Stop Queue Simulation', 'Medium'],
  ['Exam Grade Curve', 'Beginner'],
  ['Pixel Art Mirror', 'Medium'],
  ['Robot Vacuum Path', 'Hard'],
  ['Parking Lot Spots', 'Medium'],
  ['Password Strength Checker', 'Easy'],
  ['Temperature Converter Table', 'Beginner'],
  ['Shopping Cart Discounts', 'Easy'],
  ['Matrix Spiral Walk', 'Hard'],
  ['Elevator Request Planner', 'Hard'],
  ['Calendar Meeting Overlap', 'Medium'],
  ['Word Ladder Steps', 'Hard'],
  ['Balanced Team Picker', 'Medium'],
  ['Coin Change Machine', 'Medium'],
  ['Snake Game Collision', 'Hard'],
  ['Morse Code Translator', 'Easy'],
  ['Hidden Treasure Grid', 'Medium'],
  ['Domino Chain', 'Hard'],
  ['Recipe Scaling', 'Beginner'],
  ['Traffic Light Timer', 'Beginner'],
  ['Smart Thermostat Log', 'Easy'],
];

/** Every title in each language, so each language has a full bank. */
export const CHALLENGES: readonly Omit<Challenge, 'status'>[] = CHALLENGE_LANGUAGES.flatMap(
  (language, l) =>
    TITLES.map(([title, difficulty], t) => ({
      id: `c-${language}-${t + 1}`,
      number: l * TITLES.length + t + 1,
      title,
      language,
      difficulty,
    })),
);
