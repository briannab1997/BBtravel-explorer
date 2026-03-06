import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>✈️ Jet<strong>set</strong></span>
          <p className={styles.tagline}>Discover the world, one city at a time.</p>
        </div>

        <div className={styles.links}>
          <div className={styles.group}>
            <span className={styles.groupTitle}>Explore</span>
            <Link to="/">Home</Link>
            <Link to="/explore/Paris">Paris</Link>
            <Link to="/explore/Tokyo">Tokyo</Link>
            <Link to="/explore/New York City">New York</Link>
          </div>
          <div className={styles.group}>
            <span className={styles.groupTitle}>Account</span>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/dashboard">My Trips</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Jetset · Built by Brianna Brockington</span>
      </div>
    </footer>
  )
}
