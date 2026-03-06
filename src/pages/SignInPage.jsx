import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signIn, signInWithGoogle } from '@/services/supabase/authService'
import Button from '@/components/ui/Button'
import styles from './AuthPage.module.css'

export default function SignInPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn({ email, password })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>✈️ Jet<strong>set</strong></Link>
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your account</p>

        <button className={styles.googleBtn} onClick={signInWithGoogle}>
          <img src="https://www.google.com/favicon.ico" alt="Google" width={18} />
          Continue with Google
        </button>

        <div className={styles.divider}><span>or</span></div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email" required
              className={styles.input}
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password" required
              className={styles.input}
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" loading={loading} style={{ width: '100%' }}>
            Sign In
          </Button>
        </form>

        <p className={styles.foot}>
          Don&apos;t have an account? <Link to="/signup" className={styles.footLink}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
