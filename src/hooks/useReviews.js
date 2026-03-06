import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getReviewsForCity, getCityStats,
  getUserReview, submitReview, deleteReview,
} from '@/services/supabase/reviewsService'

export function useCityReviews(cityName) {
  const { user }                = useAuth()
  const [reviews, setReviews]   = useState([])
  const [stats, setStats]       = useState({ average: 0, count: 0 })
  const [userReview, setUserReview] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(0)
  const PAGE_SIZE = 10

  const fetchAll = useCallback(async () => {
    if (!cityName) return
    setLoading(true)
    const [{ data: reviewData }, statsData] = await Promise.all([
      getReviewsForCity(cityName, { page, pageSize: PAGE_SIZE }),
      getCityStats(cityName),
    ])
    setReviews(reviewData || [])
    setStats(statsData)
    setLoading(false)
  }, [cityName, page])

  useEffect(() => { fetchAll() }, [fetchAll])

  useEffect(() => {
    if (!user || !cityName) return
    getUserReview(user.id, cityName).then(({ data }) => setUserReview(data))
  }, [user, cityName])

  const submit = useCallback(async (reviewData) => {
    if (!user) return false
    const { error } = await submitReview({ userId: user.id, cityName, ...reviewData })
    if (!error) { fetchAll() }
    return !error
  }, [user, cityName, fetchAll])

  const remove = useCallback(async (reviewId) => {
    await deleteReview(reviewId)
    fetchAll()
  }, [fetchAll])

  return {
    reviews, stats, userReview, loading,
    page, setPage, submit, remove, refetch: fetchAll,
  }
}
