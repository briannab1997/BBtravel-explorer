import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signUp, signInWithGoogle } from '@/services/supabase/authService'
import Button from '@/components/ui/Button'
import styles from './AuthPage.module.css'

export default function SignUpPage() {
  const navigate = useNavigate()

  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const strength = password.length === 0 ? 0
    : password.length < 6  ? 1
    : password.length < 10 ? 2
    : 3

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    const { error: err } = await signUp({ email, password, fullName })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>✈️ <strong>Travel</strong>Explorer</Link>
        <h1 className={styles.heading}>Create your account</h1>
        <p className={styles.sub}>Start planning your dream trips</p>

        <button className={styles.googleBtn} onClick={signInWithGoogle}>
          <img src="https://www.google.com/favicon.ico" alt="Google" width={18} />
          Continue with Google
        </button>

        <div className={styles.divider}><span>or</span></div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label className={styles.label}>Full name</label>
            <input
              type="text" required
              className={styles.input}
              placeholder="Brianna Brockington"
              value={fullName} onChange={e => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {password && (
              <div className={styles.strength}>
                <div className={[styles.bar, styles[['', 'weak', 'medium', 'strong'][strength]]].join(' ')} />
                <span className={styles.strengthLabel}>{['', 'Weak', 'Good', 'Strong'][strength]}</span>
              </div>
            )}
          </div>

          <Button type="submit" loading={loading} style={{ width: '100%' }}>
            Create Account
          </Button>
        </form>

        <p className={styles.foot}>
          Already have an account? <Link to="/signin" className={styles.footLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
