import { createContext, useContext, useEffect, useState } from 'react'
import { getSession, setSession } from '@/lib/mockDb'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session from sessionStorage on mount
    const session = getSession()
    setUser(session ?? null)
    setLoading(false)

    // Listen for auth changes dispatched by mockDb helpers
    function handleAuthChange(e) {
      setUser(e.detail ?? null)
    }
    window.addEventListener('mockAuthChange', handleAuthChange)
    return () => window.removeEventListener('mockAuthChange', handleAuthChange)
  }, [])

  const signOut = () => setSession(null)

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
