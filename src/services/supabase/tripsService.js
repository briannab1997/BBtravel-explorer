import { getTable, setTable, uid, now, ok, fail } from '@/lib/mockDb'

export async function getSavedTrips(userId) {
  const trips = getTable('saved_trips').filter(t => t.user_id === userId)
  trips.sort((a, b) => b.created_at.localeCompare(a.created_at))
  return ok(trips)
}

export async function saveTrip({ userId, cityName, country, wikiPhoto }) {
  const trips = getTable('saved_trips')
  const existing = trips.findIndex(
    t => t.user_id === userId && t.city_name === cityName
  )

  if (existing !== -1) {
    trips[existing] = { ...trips[existing], country, wiki_photo: wikiPhoto }
  } else {
    trips.push({
      id:         uid(),
      user_id:    userId,
      city_name:  cityName,
      country:    country,
      wiki_photo: wikiPhoto,
      created_at: now(),
    })
  }

  setTable('saved_trips', trips)
  return ok(null)
}

export async function removeSavedTrip(userId, cityName) {
  const trips = getTable('saved_trips').filter(
    t => !(t.user_id === userId && t.city_name === cityName)
  )
  setTable('saved_trips', trips)
  return ok(null)
}

export async function isCitySaved(userId, cityName) {
  const trips = getTable('saved_trips')
  return !!trips.find(t => t.user_id === userId && t.city_name === cityName)
}
