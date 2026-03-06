import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getUserItineraries, getItinerary, createItinerary,
  deleteItinerary, addItineraryItem, deleteItineraryItem,
} from '@/services/supabase/itineraryService'

export function useUserItineraries() {
  const { user }              = useAuth()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(false)

  const fetch_ = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await getUserItineraries(user.id)
    setItems(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch_() }, [fetch_])

  const create = useCallback(async (payload) => {
    if (!user) return null
    const { data } = await createItinerary({ userId: user.id, ...payload })
    fetch_()
    return data
  }, [user, fetch_])

  const remove = useCallback(async (id) => {
    await deleteItinerary(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  return { items, loading, create, remove, refetch: fetch_ }
}

export function useSingleItinerary(itineraryId) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    if (!itineraryId) return
    setLoading(true)
    const { data: result } = await getItinerary(itineraryId)
    setData(result)
    setLoading(false)
  }, [itineraryId])

  useEffect(() => { fetch_() }, [fetch_])

  const addItem = useCallback(async (payload) => {
    const { data: item } = await addItineraryItem({ itineraryId, ...payload })
    if (item) {
      setData(prev => ({
        ...prev,
        itinerary_items: [...(prev?.itinerary_items || []), item],
      }))
    }
    return item
  }, [itineraryId])

  const removeItem = useCallback(async (itemId) => {
    await deleteItineraryItem(itemId)
    setData(prev => ({
      ...prev,
      itinerary_items: prev?.itinerary_items?.filter(i => i.id !== itemId) || [],
    }))
  }, [])

  return { data, loading, addItem, removeItem, refetch: fetch_ }
}
