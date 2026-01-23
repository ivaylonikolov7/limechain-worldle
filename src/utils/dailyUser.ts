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
 * Simple seeded hash function for deterministic randomness
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
 */
export function getDailyUser(date: Date = new Date()): User {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const seed = seededHash(dateString);
  
  const data = employeesData as EmployeesData;
  const users = data.users;
  
  if (users.length === 0) {
    throw new Error('No users available');
  }
  
  const index = seed % users.length;
  return users[index];
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
