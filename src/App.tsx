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
import { WelcomeBanner } from './components/WelcomeBanner'
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
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false)
  const [legendCollapsed, setLegendCollapsed] = useState(false)

  const remainingGuesses = 6 - guesses.length
  const canGuess = remainingGuesses > 0 && !isCorrect && !gameOver

  // Check if this is the user's first visit and mark as visited
  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem('lime-wordle-has-visited')
      if (!hasVisited || hasVisited !== 'true') {
        // First visit - show banner and immediately mark as visited
        setShowWelcomeBanner(true)
        localStorage.setItem('lime-wordle-has-visited', 'true')
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount

  // Handle dismissing the banner (just hides it, flag already set)
  const handleDismissBanner = () => {
    setShowWelcomeBanner(false)
  }

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
        updateStats(guess.isCorrect)
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
        
        <div className="color-legend">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: legendCollapsed ? '0' : '0.75rem' }}>
            <div className="legend-title" style={{ marginBottom: 0 }}>Color indicators</div>
            <button
              onClick={() => setLegendCollapsed(!legendCollapsed)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#4CF3AF',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.25rem 0.5rem',
                lineHeight: '1'
              }}
              aria-label={legendCollapsed ? 'Expand legend' : 'Collapse legend'}
            >
              {legendCollapsed ? '▼' : '▲'}
            </button>
          </div>
          {!legendCollapsed && (
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color correct"></div>
              <span>Correct</span>
            </div>
            <div className="legend-item">
              <div className="legend-color incorrect"></div>
              <span>Incorrect</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>↑</span>
              <span>guess started after today's employee</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>↓</span>
              <span>guess started before today's employee</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>↑</span>
              <span>letter comes before today's employee</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>↓</span>
              <span>letter comes after today's employee</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>✓</span>
              <span>letter matches exactly</span>
            </div>
          </div>
          )}
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

        {showWelcomeBanner && (
          <WelcomeBanner onDismiss={handleDismissBanner} />
        )}

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
