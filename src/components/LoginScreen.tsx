import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import logo from '../assets/logo.png'

export function LoginScreen() {
  const { signInWithGoogle } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1D252F',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(29, 37, 47, 0.9)',
        border: '2px solid #4CF3AF',
        borderRadius: '12px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(76, 243, 175, 0.2)'
      }}>
        <img 
          src={logo} 
          alt="LimeChain Logo" 
          style={{ height: '80px', width: 'auto', marginBottom: '2rem' }}
        />
        <h1 style={{
          color: '#4CF3AF',
          fontSize: '2rem',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          Познай днешното Лаймче!
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          Влезте с вашия Google акаунт, за да играете
        </p>
        <p style={{
          color: 'rgba(76, 243, 175, 0.7)',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          Достъпът е ограничен до @limechain.tech имейли
        </p>
        
        {error && (
          <div style={{
            background: 'rgba(248, 113, 113, 0.2)',
            border: '1px solid #f87171',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#f87171'
          }}>
            {error}
          </div>
        )}

        <Button
          onClick={handleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#4CF3AF80' : '#4CF3AF',
            color: '#1D252F',
            fontSize: '1rem',
            fontWeight: '600',
            padding: '0.75rem 1.5rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Влизане...' : 'Влез с Google'}
        </Button>
      </div>
    </div>
  )
}
