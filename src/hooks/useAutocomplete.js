import { useState, useCallback, useRef } from 'react'
import { fetchCitySuggestions } from '@/services/geoService'

export function useAutocomplete() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading]         = useState(false)
  const timerRef = useRef(null)

  const search = useCallback((query) => {
    clearTimeout(timerRef.current)
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      const results = await fetchCitySuggestions(query)
      setSuggestions(results)
      setLoading(false)
    }, 300)
  }, [])

  const clear = useCallback(() => {
    clearTimeout(timerRef.current)
    setSuggestions([])
  }, [])

  return { suggestions, loading, search, clear }
}
