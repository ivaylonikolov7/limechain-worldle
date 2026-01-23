import { useMemo, useState, useEffect } from 'react'
import { HelpCircle, User, BarChart3 } from 'lucide-react'
import { getDailyUser, getAllUsers, type User as UserType } from './utils/dailyUser'
import { Combobox } from '@/components/ui/combobox'
import { GuessesGrid } from './components/GuessesGrid'
import { ResultSection } from './components/ResultSection'
import { RulesDialog } from './components/RulesDialog'
import { AuthorDialog } from './components/AuthorDialog'
import { HintDialog } from './components/HintDialog'
import { StatsDialog } from './components/StatsDialog'
import { updateStats } from './utils/stats'
import { trackGuess } from './utils/guessTracking.firestore'
import './App.css'

interface Guess {
  user: UserType
  isCorrect: boolean
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function App() {
  const dailyUser = useMemo(() => getDailyUser(), [])
  const allUsers = useMemo(() => getAllUsers(), [])
  const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined)
  const [authorOpen, setAuthorOpen] = useState(false)
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [hintShown, setHintShown] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [statsUpdated, setStatsUpdated] = useState(false)

  const remainingGuesses = 6 - guesses.length
  const canGuess = remainingGuesses > 0 && !isCorrect && !gameOver

  const handleGuess = (user: UserType | undefined) => {
    if (!user || !canGuess) return
    
    const guess: Guess = {
      user,
      isCorrect: user.name === dailyUser.name && user.displayName === dailyUser.displayName
    }
    
    const newGuesses = [...guesses, guess]
    setGuesses(newGuesses)
    setSelectedUser(undefined)
    setIsCorrect(guess.isCorrect)
    
    if (guess.isCorrect || newGuesses.length >= 6) {
      setGameOver(true)
      // Update stats when game ends (only once per game)
      if (!statsUpdated) {
        updateStats(guess.isCorrect, newGuesses.length)
        setStatsUpdated(true)
        
        // Track guess across all users
        const today = new Date().toISOString().split('T')[0]
        trackGuess(today, guess.isCorrect).catch(console.error)
      }
    }
    
    // Show hint after 4th guess if not correct and hint hasn't been shown
    if (newGuesses.length === 4 && !guess.isCorrect && !hintShown) {
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

  // Filter out already guessed users and shuffle
  const availableUsers = useMemo(() => {
    const guessedNames = new Set(guesses.map(g => `${g.user.name}|${g.user.displayName}`))
    const filtered = allUsers.filter(user => !guessedNames.has(`${user.name}|${user.displayName}`))
    return shuffleArray(filtered)
  }, [allUsers, guesses])

  return (
    <>
      <div className="container">
        <div className="header-buttons">
          <button 
            className="header-button"
            onClick={() => setRulesOpen(true)}
            aria-label="How to Play"
          >
            <HelpCircle size={24} />
          </button>
          <button 
            className="header-button"
            onClick={() => setStatsOpen(true)}
            aria-label="Statistics"
          >
            <BarChart3 size={24} />
          </button>
          <button 
            className="header-button"
            onClick={() => {
              console.log('Author button clicked, opening dialog')
              setAuthorOpen(true)
            }}
            aria-label="Author"
          >
            <User size={24} />
          </button>
        </div>
        <div className="game-header">
          <div className="header-content">
            <img 
              src="https://sofia.businessrun.bg/wp-content/uploads/2023/04/limechain.png" 
              alt="LimeChain Logo" 
              className="header-logo"
            />
            <div className="header-text">
              <h1>Познай днешното лаймче!</h1>
            </div>
          </div>
        </div>

        {!gameOver && !isCorrect && (
          <div className="guess-input-section">
            <div className="combobox-container">
              <Combobox
                items={availableUsers}
                value={selectedUser}
                onValueChange={handleGuess}
                placeholder="Type employee name..."
                searchPlaceholder="Search employees..."
                emptyText="No employees found."
                getItemLabel={(user) => user.name}
                getItemValue={(user) => `${user.name}|${user.displayName}`}
                disabled={remainingGuesses === 0 || guesses.length >= 6}
              />
            </div>
            <p className="guesses-remaining" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>още {remainingGuesses} шанса</span>
              <img 
                src="https://cdn.frankerfacez.com/emoticon/730208/animated/2" 
                alt=""
                style={{ width: '24px', height: '24px', display: 'block' }}
              />
            </p>
          </div>
        )}

        <GuessesGrid guesses={guesses} dailyUser={dailyUser} />

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

        <div className="color-legend">
          <div className="legend-title">Color indicators</div>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color correct"></div>
              <span>Correct</span>
            </div>
            <div className="legend-item">
              <div className="legend-color incorrect"></div>
              <span>Incorrect</span>
            </div>
          </div>
        </div>

        <p className="info italic ">
          Всеки ден се избира ново лаймче на произволен принцип.
        </p>
      </div>

      <RulesDialog 
        open={rulesOpen} 
        onOpenChange={setRulesOpen}
      />
      <AuthorDialog 
        open={authorOpen} 
        onOpenChange={setAuthorOpen}
      />
      <HintDialog 
        dailyUser={dailyUser}
        open={hintOpen} 
        onOpenChange={setHintOpen}
      />
      <StatsDialog 
        open={statsOpen} 
        onOpenChange={setStatsOpen}
      />
    </>
  )
}

export default App
