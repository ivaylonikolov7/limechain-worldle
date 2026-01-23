/**
 * Firestore implementation for tracking guesses
 * 
 * Collection structure in Firestore:
 * Collection: "guesses"
 * Document ID: auto-generated
 * Fields:
 *   - guessed: boolean
 *   - timestamp: number
 *   - date: string (YYYY-MM-DD) - for querying/filtering
 */

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

export interface GuessResult {
  guessed: boolean
  timestamp: number
}

export interface DailyStats {
  date: string
  guessed: number
  notGuessed: number
  total: number
}

/**
 * Track a single guess result
 */
export async function trackGuess(
  date: string, // YYYY-MM-DD format
  isCorrect: boolean
): Promise<void> {
  try {
    await addDoc(collection(db, 'guesses'), {
      guessed: isCorrect,
      timestamp: Timestamp.now(),
      date: date // Store date for easy querying
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
    const q = query(
      collection(db, 'guesses'),
      where('date', '==', date)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) return null
    
    const allGuesses: GuessResult[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      // Handle Firestore Timestamp conversion
      let timestamp: number
      if (data.timestamp?.toMillis) {
        timestamp = data.timestamp.toMillis()
      } else if (data.timestamp?.seconds) {
        timestamp = data.timestamp.seconds * 1000
      } else {
        timestamp = data.timestamp || Date.now()
      }
      
      allGuesses.push({
        guessed: data.guessed,
        timestamp
      })
    })
    
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
