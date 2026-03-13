import { getTable, setTable, uid, now, ok, fail, seedIfNeeded } from '@/lib/mockDb'

function ensureSeeded() {
  seedIfNeeded()
}

export async function getReviewsForCity(cityName, { page = 0, pageSize = 10 } = {}) {
  ensureSeeded()
  const all = getTable('reviews')
    .filter(r => r.city_name === cityName)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))

  const slice = all.slice(page * pageSize, (page + 1) * pageSize)
  return { data: slice, error: null, count: all.length }
}

export async function getCityStats(cityName) {
  ensureSeeded()
  const ratings = getTable('reviews')
    .filter(r => r.city_name === cityName)
    .map(r => r.rating)

  if (!ratings.length) return { average: 0, count: 0 }

  const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length
  return { average: Math.round(avg * 10) / 10, count: ratings.length }
}

export async function getUserReview(userId, cityName) {
  ensureSeeded()
  const review = getTable('reviews').find(
    r => r.user_id === userId && r.city_name === cityName
  ) ?? null
  return ok(review)
}

export async function submitReview({ userId, cityName, rating, title, body, visitedAt }) {
  ensureSeeded()
  const reviews  = getTable('reviews')
  const profiles = getTable('profiles')
  const profile  = profiles.find(p => p.id === userId)

  const existing = reviews.findIndex(
    r => r.user_id === userId && r.city_name === cityName
  )

  const review = {
    id:         existing !== -1 ? reviews[existing].id : uid(),
    user_id:    userId,
    city_name:  cityName,
    rating,
    title:      title || '',
    body:       body || '',
    visited_at: visitedAt || null,
    created_at: existing !== -1 ? reviews[existing].created_at : now(),
    profiles:   { display_name: profile?.display_name ?? 'Traveler', avatar_url: profile?.avatar_url ?? null },
  }

  if (existing !== -1) {
    reviews[existing] = review
  } else {
    reviews.push(review)
  }

  setTable('reviews', reviews)
  return ok(review)
}

export async function deleteReview(reviewId) {
  setTable('reviews', getTable('reviews').filter(r => r.id !== reviewId))
  return ok(null)
}
