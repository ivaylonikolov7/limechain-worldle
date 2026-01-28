import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isAuthorized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ALLOWED_DOMAIN = '@limechain.tech'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const email = result.user.email
      
      if (!email || !email.endsWith(ALLOWED_DOMAIN)) {
        // Sign out if email doesn't match
        await signOut(auth)
        throw new Error(`Access denied. Only ${ALLOWED_DOMAIN} emails are allowed.`)
      }
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const isAuthorized = user !== null && 
    user.email !== null && 
    user.email.endsWith(ALLOWED_DOMAIN)

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
