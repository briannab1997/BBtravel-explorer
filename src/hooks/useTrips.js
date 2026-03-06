import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getSavedTrips, saveTrip, removeSavedTrip, isCitySaved,
} from '@/services/supabase/tripsService'

export function useSavedTrips() {
  const { user }                 = useAuth()
  const [trips, setTrips]        = useState([])
  const [loading, setLoading]    = useState(false)

  const fetchTrips = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await getSavedTrips(user.id)
    setTrips(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  const save = useCallback(async (tripData) => {
    if (!user) return false
    await saveTrip({ userId: user.id, ...tripData })
    fetchTrips()
    return true
  }, [user, fetchTrips])

  const remove = useCallback(async (cityName) => {
    if (!user) return
    await removeSavedTrip(user.id, cityName)
    setTrips(prev => prev.filter(t => t.city_name !== cityName))
  }, [user])

  return { trips, loading, save, remove, refetch: fetchTrips }
}

export function useCitySaved(cityName) {
  const { user }               = useAuth()
  const [saved, setSaved]      = useState(false)
  const [checking, setChecking]= useState(false)

  useEffect(() => {
    if (!user || !cityName) return
    setChecking(true)
    isCitySaved(user.id, cityName).then(result => {
      setSaved(result)
      setChecking(false)
    })
  }, [user, cityName])

  return { saved, setSaved, checking }
}
