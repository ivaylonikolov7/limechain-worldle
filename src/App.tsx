import { useMemo, useState, useEffect } from 'react'
import { HeaderButtons } from './components/HeaderButtons'
import { getDailyUser } from './utils/dailyUser'
import logo from './assets/logo.png'
import { Game } from './components/Game'
import { WelcomeBanner } from './components/WelcomeBanner'
import { LoginScreen } from './components/LoginScreen'
import { useAuth } from './contexts/AuthContext'
import { hasUserGuessedToday } from './utils/guessTracking.firestore'
import { hasPlayedTodayFromCookie } from './utils/cookies'
import './App.css'

function App() {
  const { user: authUser, loading, isAuthorized, logout } = useAuth()
  const dailyUser = useMemo(() => getDailyUser(), [])
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false)
  const [hasPlayedToday, setHasPlayedToday] = useState(false)
  const [checkingPlayedToday, setCheckingPlayedToday] = useState(true)

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

  // Check if user has already played today
  useEffect(() => {
    const checkIfPlayedToday = async () => {
      setCheckingPlayedToday(true)
      
      // Check both cookie and Firestore
      const hasPlayedCookie = hasPlayedTodayFromCookie()
      
      // Check Firestore (for authenticated users) - this is the source of truth
      let hasPlayedFirestore = false
      if (authUser?.email) {
        const today = new Date().toISOString().split('T')[0]
        hasPlayedFirestore = await hasUserGuessedToday(authUser.email, today)
      }
      
      // User has played if either cookie or Firestore says so
      // Firestore is the source of truth, but cookie provides fast initial check
      const hasPlayed = hasPlayedCookie || hasPlayedFirestore
      setHasPlayedToday(hasPlayed)
      
      // If Firestore says they played but cookie doesn't, set the cookie
      if (hasPlayedFirestore && !hasPlayedCookie) {
        const { setPlayedTodayCookie } = await import('./utils/cookies')
        setPlayedTodayCookie()
      }
      
      setCheckingPlayedToday(false)
    }
    
    checkIfPlayedToday()
  }, [authUser?.email, dailyUser.name, dailyUser.displayName])

  // Handle dismissing the banner (just hides it, flag already set)
  const handleDismissBanner = () => {
    setShowWelcomeBanner(false)
  }

  // Reset hasPlayedToday when daily user changes (new day)
  useEffect(() => {
    setHasPlayedToday(false)
  }, [dailyUser.name, dailyUser.displayName])


  // Show loading state while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1D252F',
        color: '#4CF3AF'
      }}>
        Зареждане...
      </div>
    )
  }

  // Show login screen if not authorized
  if (!isAuthorized) {
    return <LoginScreen />
  }

  return (
    <>
      <div className="container">
        <div className="game-header">
          <div className="header-content">
            <img 
              src={logo} 
              alt="LimeChain Logo" 
              className="header-logo"
              style={{ border: 'none', outline: 'none' }}
            />
            <p style={{ 
              color: '#4CF3AF', 
              fontSize: '1.5rem', 
              marginTop: '1rem',
              textAlign: 'center',
              fontWeight: '600',
              marginBottom: 0,
              fontFamily: "'Poppins', 'Montserrat', sans-serif"
            }}>
              Limedle
            </p>
          </div>
        </div>

        {showWelcomeBanner && (
          <WelcomeBanner onDismiss={handleDismissBanner} />
        )}

        <Game
          dailyUser={dailyUser}
          authUserEmail={authUser?.email}
          hasPlayedToday={hasPlayedToday}
          checkingPlayedToday={checkingPlayedToday}
        />

        <p className="info italic ">
          Всеки ден се избира ново Лаймче на произволен принцип.
        </p>

        <HeaderButtons
          onLogout={logout}
          userEmail={authUser?.email}
        />
      </div>
    </>
  )
}

export default App
