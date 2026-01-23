/**
 * Service for tracking employee guesses across all users
 * 
 * Tracks only the end result (guessed/not guessed) per day
 * 
 * Options:
 * 1. Firebase Realtime Database (recommended - easiest setup)
 * 2. Supabase (PostgreSQL-based, easy API)
 * 3. Vercel KV / Upstash (Redis key-value store)
 * 4. Cloudflare D1 (SQLite at edge)
 */

export interface GuessResult {
  guessed: boolean // true if user guessed correctly, false otherwise
  timestamp: number // when the guess was recorded (can derive date from this)
}

export interface DailyStats {
  date: string // YYYY-MM-DD (derived from timestamp)
  guessed: number // count of users who guessed correctly
  notGuessed: number // count of users who didn't guess correctly
  total: number // total users who played
}

// ============================================
// OPTION 1: Firebase Firestore (Recommended)
// ============================================
// Install: npm install firebase
// Setup: https://firebase.google.com/docs/firestore/quickstart
//
// 1. Create firebase.ts from firebase.example.ts
// 2. Copy your Firebase config from Firebase Console
// 3. Create a collection called "guesses" in Firestore
// 4. Import and use the functions from guessTracking.firestore.ts
//
// Collection structure:
// Collection: "guesses"
// Fields per document:
//   - guessed: boolean
//   - timestamp: Timestamp
//   - date: string (YYYY-MM-DD)

/**
 * Track a single guess result (only the end result, not individual attempts)
 * Each user's result is stored as a separate entry
 * Date is derived from timestamp for filtering
 */
export async function trackGuess(
  date: string, // Used for organizing in database (guesses/{date}/)
  isCorrect: boolean
): Promise<void> {
  // TODO: Implement with your chosen service
  // Example with Firebase:
  // const guessRef = ref(db, `guesses/${date}`)
  // const newGuessRef = push(guessRef)
  // await set(newGuessRef, {
  //   guessed: isCorrect,
  //   timestamp: Date.now()
  // })
  
  console.log('Track guess:', { date, guessed: isCorrect })
}

/**
 * Get aggregated stats for a specific date
 * Date is used to query the database, but not stored in each entry
 */
export async function getDailyStats(date: string): Promise<DailyStats | null> {
  // TODO: Implement with your chosen service
  // Example with Firebase:
  // const dateRef = ref(db, `guesses/${date}`)
  // const snapshot = await get(dateRef)
  // const allGuesses = Object.values(snapshot.val() || {}) as GuessResult[]
  // 
  // if (allGuesses.length === 0) return null
  // 
  // const guessed = allGuesses.filter(g => g.guessed).length
  // const notGuessed = allGuesses.filter(g => !g.guessed).length
  // 
  // return {
  //   date, // Return date for convenience, but it's derived from the query path
  //   guessed,
  //   notGuessed,
  //   total: allGuesses.length
  // }
  
  return null
}

// ============================================
// OPTION 2: Supabase
// ============================================
// Install: npm install @supabase/supabase-js
// Setup: https://supabase.com/docs/guides/getting-started
//
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')
//
// export async function trackGuess(employeeId: string, date: string, isCorrect: boolean) {
//   const { data, error } = await supabase
//     .from('guess_tracking')
//     .upsert({
//       employee_id: employeeId,
//       date: date,
//       guessed: isCorrect ? 1 : 0,
//       not_guessed: !isCorrect ? 1 : 0
//     }, { onConflict: 'employee_id,date' })
// }

// ============================================
// OPTION 3: Vercel KV / Upstash
// ============================================
// Install: npm install @vercel/kv
// Setup: https://vercel.com/docs/storage/vercel-kv
//
// import { kv } from '@vercel/kv'
//
// export async function trackGuess(employeeId: string, date: string, isCorrect: boolean) {
//   const key = `guess:${date}:${employeeId}`
//   const current = await kv.get<GuessTracking>(key) || { guessed: 0, notGuessed: 0, totalAttempts: 0 }
//   
//   await kv.set(key, {
//     employeeId,
//     date,
//     guessed: isCorrect ? current.guessed + 1 : current.guessed,
//     notGuessed: !isCorrect ? current.notGuessed + 1 : current.notGuessed,
//     totalAttempts: current.totalAttempts + 1
//   })
// }
