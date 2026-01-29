import { useState, useEffect } from 'react'
import { type User as UserType, type User } from '../utils/dailyUser'
import { GuessInput } from './GuessInput'
import { GuessesGrid } from './GuessesGrid'
import { ResultSection } from './ResultSection'
import { HintDialog } from './HintDialog'
import { trackGuess } from '../utils/guessTracking.firestore'
import { setPlayedTodayCookie } from '../utils/cookies'

interface Guess {
  user: UserType
  isCorrect: boolean
}

interface GameProps {
  dailyUser: User
  authUserEmail?: string | null
  hasPlayedToday: boolean
  checkingPlayedToday: boolean
}

export function Game({
  dailyUser,
  authUserEmail,
  hasPlayedToday,
  checkingPlayedToday
}: GameProps) {
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [hintShown, setHintShown] = useState(false)
  const [statsUpdated, setStatsUpdated] = useState(false)

  const remainingGuesses = 6 - guesses.length
  const canGuess = remainingGuesses > 0 && !isCorrect && !gameOver && !hasPlayedToday

  const handleGuess = (user: UserType) => {
    if (!canGuess || hasPlayedToday) return
    
    const guess: Guess = {
      user,
      isCorrect: user.name === dailyUser.name && user.displayName === dailyUser.displayName
    }
    
    const newGuesses = [...guesses, guess]
    setGuesses(newGuesses)
    setIsCorrect(guess.isCorrect)
    
    if (guess.isCorrect || newGuesses.length >= 6) {
      setGameOver(true)
      // Track guess when game ends (only once per game)
      if (!statsUpdated) {
        setStatsUpdated(true)
        
        // Track guess across all users with authenticated email
        const today = new Date().toISOString().split('T')[0]
        const guessNumber = newGuesses.length // The number of guesses made (1-6)
        if (authUserEmail) {
          trackGuess(today, guess.isCorrect, authUserEmail, guessNumber)
            .then(() => {
              console.log('Guess tracked successfully:', { date: today, isCorrect: guess.isCorrect, email: authUserEmail, guessNumber })
            })
            .catch((error) => {
              console.error('Error tracking guess:', error)
            })
        } else {
          console.warn('Cannot track guess: authUser email is missing')
        }
        
        // Set cookie to mark that user has played today (for next refresh)
        // Don't update state immediately - let the cookie handle it on refresh
        setPlayedTodayCookie()
      }
    }
    
    // Show hint after 5th guess if not correct and hint hasn't been shown
    if (newGuesses.length === 5 && !guess.isCorrect && !hintShown) {
      setHintOpen(true)
      setHintShown(true)
    }
  }

  // Reset game state when daily user changes (new day)
  useEffect(() => {
    setGuesses([])
    setIsCorrect(false)
    setGameOver(false)
    setHintShown(false)
    setStatsUpdated(false)
  }, [dailyUser.name, dailyUser.displayName])

  return (
    <>
      {checkingPlayedToday && (
        <p style={{ color: '#4CF3AF', margin: '1rem 0' }}>Checking if you've played today...</p>
      )}
      
      {hasPlayedToday && !checkingPlayedToday && (
        <div style={{ 
          background: 'rgba(29, 37, 47, 0.8)', 
          border: '1px solid #4CF3AF', 
          borderRadius: '12px', 
          padding: '2rem',
          maxWidth: '500px',
          margin: '1rem auto'
        }}>
          <p style={{ color: '#4CF3AF', fontSize: '1.2rem', margin: 0, textAlign: 'center' }}>
            You've already played today! Come back tomorrow for a new challenge. 🎮
          </p>
        </div>
      )}

      {!gameOver && !isCorrect && !hasPlayedToday && !checkingPlayedToday && (
        <GuessInput
          onGuess={handleGuess}
          guesses={guesses}
        />
      )}

      <GuessesGrid guesses={guesses} dailyUser={dailyUser} guessesCount={guesses.length} />

      <ResultSection 
        isCorrect={isCorrect} 
        dailyUser={dailyUser} 
        open={gameOver}
        onOpenChange={(open) => {
          if (!open) {
            setGameOver(false)
          }
        }}
      />

      <HintDialog 
        dailyUser={dailyUser}
        open={hintOpen} 
        onOpenChange={setHintOpen}
      />
    </>
  )
}
