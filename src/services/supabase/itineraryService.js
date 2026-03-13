import { getTable, setTable, uid, now, ok, fail } from '@/lib/mockDb'

export async function getUserItineraries(userId) {
  const list = getTable('itineraries').filter(i => i.user_id === userId)
  list.sort((a, b) => b.created_at.localeCompare(a.created_at))
  return ok(list)
}

export async function getItinerary(itineraryId) {
  const itinerary = getTable('itineraries').find(i => i.id === itineraryId)
  if (!itinerary) return fail('Itinerary not found')

  const items = getTable('itinerary_items')
    .filter(item => item.itinerary_id === itineraryId)
    .sort((a, b) => a.day_number - b.day_number)

  return ok({ ...itinerary, itinerary_items: items })
}

export async function createItinerary({ userId, cityName, title, startDate, endDate }) {
  const itinerary = {
    id:         uid(),
    user_id:    userId,
    city_name:  cityName,
    title:      title || `My trip to ${cityName}`,
    start_date: startDate || null,
    end_date:   endDate || null,
    created_at: now(),
  }
  const list = getTable('itineraries')
  setTable('itineraries', [...list, itinerary])
  return ok(itinerary)
}

export async function updateItinerary(id, updates) {
  const list = getTable('itineraries')
  const idx  = list.findIndex(i => i.id === id)
  if (idx === -1) return fail('Itinerary not found')

  list[idx] = { ...list[idx], ...updates }
  setTable('itineraries', list)
  return ok(list[idx])
}

export async function deleteItinerary(id) {
  setTable('itineraries', getTable('itineraries').filter(i => i.id !== id))
  setTable('itinerary_items', getTable('itinerary_items').filter(i => i.itinerary_id !== id))
  return ok(null)
}

export async function addItineraryItem({ itineraryId, dayNumber, itemName, itemType, notes, timeOfDay }) {
  const item = {
    id:           uid(),
    itinerary_id: itineraryId,
    day_number:   dayNumber,
    item_name:    itemName,
    item_type:    itemType || '',
    notes:        notes || '',
    time_of_day:  timeOfDay || 'anytime',
    created_at:   now(),
  }
  const items = getTable('itinerary_items')
  setTable('itinerary_items', [...items, item])
  return ok(item)
}

export async function deleteItineraryItem(itemId) {
  setTable('itinerary_items', getTable('itinerary_items').filter(i => i.id !== itemId))
  return ok(null)
}

export async function updateItineraryItem(itemId, updates) {
  const items = getTable('itinerary_items')
  const idx   = items.findIndex(i => i.id === itemId)
  if (idx === -1) return fail('Item not found')

  items[idx] = { ...items[idx], ...updates }
  setTable('itinerary_items', items)
  return ok(items[idx])
}
