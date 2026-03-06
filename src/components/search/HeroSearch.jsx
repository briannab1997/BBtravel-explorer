import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAutocomplete } from '@/hooks/useAutocomplete'
import AutocompleteDropdown from './AutocompleteDropdown'
import styles from './HeroSearch.module.css'

export default function HeroSearch({ compact = false }) {
  const [query, setQuery]         = useState('')
  const [selected, setSelected]   = useState(null)
  const [showDrop, setShowDrop]   = useState(false)
  const { suggestions, loading, search, clear } = useAutocomplete()
  const navigate  = useNavigate()
  const wrapRef   = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleInput = (e) => {
    const val = e.target.value
    setQuery(val)
    setSelected(null)
    search(val)
    setShowDrop(true)
  }

  const handleSelect = (s) => {
    setQuery(s.label)
    setSelected(s)
    clear()
    setShowDrop(false)
  }

  const handleExplore = () => {
    const city = selected?.city || query.split(',')[0].trim()
    if (!city) return
    navigate(`/explore/${encodeURIComponent(city)}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleExplore()
  }

  return (
    <div className={[styles.wrapper, compact ? styles.compact : ''].join(' ')} ref={wrapRef}>
      <div className={styles.inputGroup}>
        <span className={styles.icon}>🔍</span>
        <input
          type="text"
          className={styles.input}
          placeholder="Search a city or destination…"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDrop(true)}
          autoComplete="off"
        />
        <button className={styles.btn} onClick={handleExplore}>
          Explore
        </button>
      </div>

      {showDrop && (
        <AutocompleteDropdown
          suggestions={suggestions}
          loading={loading}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
