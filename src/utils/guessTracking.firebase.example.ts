/**
 * Complete Firebase Realtime Database implementation
 * 
 * Tracks only the end result (guessed/not guessed) per day
 * 
 * To use this:
 * 1. Install: npm install firebase
 * 2. Create src/config/firebase.ts with your config
 * 3. Replace the functions in guessTracking.ts with these
 */

import { getDatabase, ref, get, set, push } from 'firebase/database'
import { db } from '../config/firebase' // You'll need to create this

export interface GuessResult {
  guessed: boolean
  timestamp: number
}

export interface DailyStats {
  date: string // YYYY-MM-DD (derived from query path, not stored in each entry)
  guessed: number
  notGuessed: number
  total: number
}

/**
 * Track a single guess result (only the end result)
 * Each user's result is stored as a separate entry under the date
 * Date is only used for organizing in database, not stored in entry
 */
export async function trackGuess(
  date: string, // Used for organizing: guesses/{date}/
  isCorrect: boolean
): Promise<void> {
  try {
    const dateRef = ref(db, `guesses/${date}`)
    const newGuessRef = push(dateRef)
    await set(newGuessRef, {
      guessed: isCorrect,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error tracking guess:', error)
  }
}

/**
 * Get aggregated stats for a specific date
 */
export async function getDailyStats(date: string): Promise<DailyStats | null> {
  try {
    const dateRef = ref(db, `guesses/${date}`)
    const snapshot = await get(dateRef)
    const data = snapshot.val()
    
    if (!data) return null
    
    const allGuesses = Object.values(data) as GuessResult[]
    
    const guessed = allGuesses.filter(g => g.guessed).length
    const notGuessed = allGuesses.filter(g => !g.guessed).length
    
    return {
      date,
      guessed,
      notGuessed,
      total: allGuesses.length
    }
  } catch (error) {
    console.error('Error getting daily stats:', error)
    return null
  }
}

/**
 * Get percentage of users who guessed correctly for a specific date
 */
export async function getGuessPercentage(date: string): Promise<number> {
  const stats = await getDailyStats(date)
  if (!stats || stats.total === 0) return 0
  
  return Math.round((stats.guessed / stats.total) * 100)
}
