import { supabase } from '@/lib/supabaseClient'

export async function getReviewsForCity(cityName, { page = 0, pageSize = 10 } = {}) {
  return supabase
    .from('reviews')
    .select('*, profiles(display_name, avatar_url)', { count: 'exact' })
    .eq('city_name', cityName)
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1)
}

export async function getCityStats(cityName) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('city_name', cityName)

  if (error || !data?.length) return { average: 0, count: 0 }

  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
  return { average: Math.round(avg * 10) / 10, count: data.length }
}

export async function getUserReview(userId, cityName) {
  return supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('city_name', cityName)
    .maybeSingle()
}

export async function submitReview({ userId, cityName, rating, title, body, visitedAt }) {
  return supabase.from('reviews').upsert({
    user_id:    userId,
    city_name:  cityName,
    rating,
    title:      title || '',
    body:       body || '',
    visited_at: visitedAt || null,
  })
}

export async function deleteReview(reviewId) {
  return supabase.from('reviews').delete().eq('id', reviewId)
}
