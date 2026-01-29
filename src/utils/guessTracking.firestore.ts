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
  setDoc,
  doc,
  getDoc,
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
 * Encode email to be safe for use in document IDs
 * Replaces @ with _at_ and . with _dot_
 */
function encodeEmailForDocId(email: string): string {
  return email.replace(/@/g, '_at_').replace(/\./g, '_dot_')
}

/**
 * Track a single guess result
 * Uses emailDate as the document ID to ensure uniqueness
 */
export async function trackGuess(
  date: string, // YYYY-MM-DD format
  isCorrect: boolean,
  email: string, // Authenticated user's email (from Firebase Auth)
  guessNumber: number // Which guess number (1-6) the user was on
): Promise<void> {
  try {
    console.log('Attempting to track guess:', { date, isCorrect, email, guessNumber })
    
    // Create unique emailDate: email_date (e.g., "ivnikolov721_at_gmail_dot_com_2026-08-26")
    // Encode email to make it safe for document ID
    const encodedEmail = encodeEmailForDocId(email)
    const emailDate = `${encodedEmail}_${date}`
    
    // Check if document already exists (using document ID)
    const docRef = doc(db, 'guesses', emailDate)
    const docSnapshot = await getDoc(docRef)
    
    if (docSnapshot.exists()) {
      throw new Error('User has already guessed today')
    }
    
    // Use setDoc with emailDate as document ID to ensure uniqueness
    await setDoc(docRef, {
      guessed: isCorrect,
      timestamp: Timestamp.now(),
      date: date, // Store date for easy querying
      email: email, // Store authenticated user's email
      guessNumber: guessNumber, // Store which guess number (1-6)
      emailDate: emailDate // Also store as field for querying
    })
    console.log('Guess tracked successfully with document ID:', emailDate)
  } catch (error) {
    console.error('Error tracking guess:', error)
    throw error // Re-throw to allow caller to handle
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

/**
 * Check if a user has already guessed today
 * Uses the emailDate as document ID for efficient checking
 */
export async function hasUserGuessedToday(email: string, date: string): Promise<boolean> {
  try {
    // Encode email the same way as in trackGuess
    const encodedEmail = encodeEmailForDocId(email)
    const emailDate = `${encodedEmail}_${date}`
    
    // Check if document exists by ID
    const docRef = doc(db, 'guesses', emailDate)
    const docSnapshot = await getDoc(docRef)
    return docSnapshot.exists()
  } catch (error) {
    console.error('Error checking if user has guessed today:', error)
    return false // If there's an error, allow them to play (fail open)
  }
}

/**
 * Get global stats across all guesses (all time)
 */
export interface GlobalStats {
  totalGuesses: number
  totalWins: number
  totalLosses: number
  averageGuessNumber: number // Average guess number for wins (1-6)
}

export async function getGlobalStats(): Promise<GlobalStats> {
  try {
    const q = query(collection(db, 'guesses'))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return {
        totalGuesses: 0,
        totalWins: 0,
        totalLosses: 0,
        averageGuessNumber: 0
      }
    }
    
    let totalWins = 0
    let totalLosses = 0
    let totalGuessNumbers = 0 // Sum of guess numbers for wins only
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      // Check both boolean true and string "true" for compatibility
      const guessedValue = data.guessed
      const isGuessed = guessedValue === true || guessedValue === 'true' || guessedValue === 1
      
      if (isGuessed) {
        totalWins++
        // Only count guess numbers for wins
        if (data.guessNumber && typeof data.guessNumber === 'number') {
          totalGuessNumbers += data.guessNumber
        }
      } else {
        totalLosses++
      }
    })
    
    const totalGuesses = totalWins + totalLosses
    const averageGuessNumber = totalWins > 0 
      ? Math.round((totalGuessNumbers / totalWins) * 10) / 10 // Round to 1 decimal place
      : 0
    
    return {
      totalGuesses,
      totalWins,
      totalLosses,
      averageGuessNumber
    }
  } catch (error) {
    console.error('Error getting global stats:', error)
    return {
      totalGuesses: 0,
      totalWins: 0,
      totalLosses: 0,
      averageGuessNumber: 0
    }
  }
}

/**
 * Get today's stats
 */
export interface TodayStats {
  totalUsers: number // How many users have guessed today
  averageGuessNumber: number // Average guess number for today (only for wins)
  winRate: number // Win rate percentage for today
}

export async function getTodayStats(date: string): Promise<TodayStats> {
  try {
    const q = query(
      collection(db, 'guesses'),
      where('date', '==', date)
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return {
        totalUsers: 0,
        averageGuessNumber: 0,
        winRate: 0
      }
    }
    
    let totalUsers = 0
    let totalGuessNumbers = 0 // Sum of guess numbers for wins only
    let winsCount = 0
    let lossesCount = 0
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      totalUsers++
      
      // Count wins and losses
      // Check both boolean true and string "true" for compatibility
      // Firestore may return booleans in different formats
      const guessedValue = data.guessed
      const isGuessed = guessedValue === true || guessedValue === 'true' || guessedValue === 1
      
      if (isGuessed) {
        winsCount++
        // Only count guess numbers for wins
        if (data.guessNumber && typeof data.guessNumber === 'number') {
          totalGuessNumbers += data.guessNumber
        }
      } else {
        lossesCount++
      }
    })
    
    const averageGuessNumber = winsCount > 0 
      ? Math.round((totalGuessNumbers / winsCount) * 10) / 10 // Round to 1 decimal place
      : 0
    
    const winRate = totalUsers > 0 
      ? Math.round((winsCount / totalUsers) * 100) 
      : 0
    
    // Debug logging
    console.log('Today stats calculation:', {
      totalUsers,
      winsCount,
      lossesCount,
      winRate,
      date,
      sampleData: querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null
    })
    
    return {
      totalUsers,
      averageGuessNumber,
      winRate
    }
  } catch (error) {
    console.error('Error getting today stats:', error)
    return {
      totalUsers: 0,
      averageGuessNumber: 0,
      winRate: 0
    }
  }
}
