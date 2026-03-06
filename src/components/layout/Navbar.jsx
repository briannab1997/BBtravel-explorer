import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Avatar from '@/components/ui/Avatar'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, signOut }   = useAuth()
  const navigate             = useNavigate()
  const location             = useLocation()
  const [menuOpen, setMenu]  = useState(false)
  const [scrolled, setScroll]= useState(false)
  const [theme, setTheme]    = useState(
    () => localStorage.getItem('theme') || 'light'
  )
  const dropRef = useRef(null)

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScroll(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMenu(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={[styles.nav, scrolled ? styles.scrolled : ''].join(' ')}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✈️</span>
          <span className={styles.logoText}>Jet<strong>set</strong></span>
        </Link>

        {/* Nav Links */}
        <div className={styles.links}>
          <Link to="/" className={[styles.link, isActive('/') ? styles.active : ''].join(' ')}>Home</Link>
          <Link to="/explore/Paris" className={[styles.link, location.pathname.startsWith('/explore') ? styles.active : ''].join(' ')}>Explore</Link>
          {user && (
            <Link to="/dashboard" className={[styles.link, isActive('/dashboard') ? styles.active : ''].join(' ')}>My Trips</Link>
          )}
        </div>

        {/* Right side */}
        <div className={styles.right}>
          {/* Theme toggle */}
          <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className={styles.userMenu} ref={dropRef}>
              <button className={styles.avatarBtn} onClick={() => setMenu(o => !o)}>
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  name={user.user_metadata?.full_name || user.email}
                  size="sm"
                />
                <span className={styles.userName}>
                  {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                </span>
                <span className={styles.caret}>{menuOpen ? '▲' : '▼'}</span>
              </button>

              {menuOpen && (
                <div className={styles.dropdown}>
                  <Link to="/dashboard" className={styles.dropItem} onClick={() => setMenu(false)}>
                    🗺️ My Trips
                  </Link>
                  <Link to="/profile" className={styles.dropItem} onClick={() => setMenu(false)}>
                    👤 Profile
                  </Link>
                  <hr className={styles.dropDivider} />
                  <button className={styles.dropItem} onClick={handleSignOut}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/signin" className={styles.signInLink}>Sign In</Link>
              <Link to="/signup" className={styles.signUpBtn}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
