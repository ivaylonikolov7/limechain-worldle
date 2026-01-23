export interface GameStats {
  totalGames: number
  gamesWon: number
  currentStreak: number
  bestStreak: number
  lastPlayedDate: string | null
}

const STATS_KEY = 'lime-wordle-stats'

export function getStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading stats from localStorage:', e)
  }
  
  return {
    totalGames: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastPlayedDate: null
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (e) {
    console.error('Error saving stats to localStorage:', e)
  }
}

export function updateStats(isWin: boolean, guessesUsed: number): GameStats {
  const stats = getStats()
  const today = new Date().toISOString().split('T')[0]
  
  // Check if this is a new day
  const isNewDay = stats.lastPlayedDate !== today
  
  // Update total games
  stats.totalGames += 1
  
  // Update games won
  if (isWin) {
    stats.gamesWon += 1
  }
  
  // Update streak
  if (isNewDay) {
    if (isWin) {
      stats.currentStreak += 1
      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak
      }
    } else {
      stats.currentStreak = 0
    }
    stats.lastPlayedDate = today
  }
  
  saveStats(stats)
  return stats
}

export function getWinRate(stats: GameStats): number {
  if (stats.totalGames === 0) return 0
  return Math.round((stats.gamesWon / stats.totalGames) * 100)
}
