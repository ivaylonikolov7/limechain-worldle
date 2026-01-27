import employeesData from '../../employees/employees.json';

interface User {
  name: string;
  displayName: string;
  role: string;
  'listens-to-chalga': boolean;
  'before-me-in-company': boolean;
  gender: string;
  imageUrl: string;
  image72: string;
  image192: string;
  image512: string;
}

interface EmployeesData {
  users: User[];
}

/**
 * Improved seeded random number generator (Mulberry32)
 * Better distribution than simple hash
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return function() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

/**
 * Simple seeded hash function for creating seed from date
 */
function seededHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Gets a deterministic random user for a given date
 * The same date will always return the same user
 * Uses improved random distribution for better variety
 */
export function getDailyUser(date: Date = new Date()): User {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const seed = seededHash(dateString);
  const random = seededRandom(seed);
  
  const data = employeesData as EmployeesData;
  const users = data.users;
  
  if (users.length === 0) {
    throw new Error('No users available');
  }
  
  // Generate multiple random values and use the average for better distribution
  // This helps avoid bias toward the end of the array
  let sum = 0;
  for (let i = 0; i < 5; i++) {
    sum += random();
  }
  const average = sum / 5;
  
  // Use the average to select index, ensuring it's properly distributed
  const index = Math.floor(average * users.length);
  
  // Ensure index is within bounds (safety check)
  const safeIndex = Math.max(0, Math.min(index, users.length - 1));
  
  return users[safeIndex];
}

// Helper function to compare users by name for equality check
export function isSameUser(user1: User, user2: User): boolean {
  return user1.name === user2.name && user1.displayName === user2.displayName;
}

/**
 * Gets the date string in YYYY-MM-DD format for a given date
 */
export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Gets all users from the employees data
 */
export function getAllUsers(): User[] {
  const data = employeesData as EmployeesData;
  return data.users;
}

export type { User };
