import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './HeroSlideshow.module.css'

const SLIDES = [
  {
    city: 'Paris',
    country: 'France',
    tagline: 'Plan your next romantic getaway',
    photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80&auto=format&fit=crop',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    tagline: 'Where neon meets ancient tradition',
    photo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80&auto=format&fit=crop',
  },
  {
    city: 'New York City',
    country: 'United States',
    tagline: 'The city that never stops inspiring',
    photo: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80&auto=format&fit=crop',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    tagline: 'Find your peace in the island of gods',
    photo: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80&auto=format&fit=crop',
  },
  {
    city: 'Rome',
    country: 'Italy',
    tagline: 'Indulge in cinematic paradise',
    photo: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80&auto=format&fit=crop',
  },
  {
    city: 'Sydney',
    country: 'Australia',
    tagline: 'Where the harbour meets the horizon',
    photo: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80&auto=format&fit=crop',
  },
]

const INTERVAL_MS = 6000

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, INTERVAL_MS)
  }, [])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  const goTo = useCallback((idx) => {
    setCurrent(idx)
    resetTimer()
  }, [resetTimer])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/explore/${encodeURIComponent(query.trim())}`)
  }

  return (
    <section className={styles.hero}>
      {/* Stacked background images — only current has opacity:1 */}
      <div className={styles.backgrounds}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.city}
            className={[styles.bg, i === current ? styles.bgActive : ''].join(' ')}
            style={{ backgroundImage: `url(${slide.photo})` }}
          />
        ))}
      </div>

      {/* Cinematic gradient overlay */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>

        {/* Animated text — key forces remount = re-triggers animation */}
        <div className={styles.textWrap} key={current}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            {SLIDES[current].city}, {SLIDES[current].country}
          </span>
          <h1 className={styles.headline}>{SLIDES[current].tagline}</h1>
          <Link
            to={`/explore/${encodeURIComponent(SLIDES[current].city)}`}
            className={styles.exploreBtn}
          >
            Explore {SLIDES[current].city} →
          </Link>
        </div>

        {/* Search bar */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search any city or destination…"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>Explore</button>
        </form>

        {/* Dot / progress indicators */}
        <div className={styles.dots}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={[styles.dot, i === current ? styles.dotActive : ''].join(' ')}
              onClick={() => goTo(i)}
              aria-label={`Go to ${SLIDES[i].city}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
