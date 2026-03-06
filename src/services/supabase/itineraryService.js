import { supabase } from '@/lib/supabaseClient'

export async function getUserItineraries(userId) {
  return supabase
    .from('itineraries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function getItinerary(itineraryId) {
  return supabase
    .from('itineraries')
    .select('*, itinerary_items(*)')
    .eq('id', itineraryId)
    .single()
}

export async function createItinerary({ userId, cityName, title, startDate, endDate }) {
  return supabase
    .from('itineraries')
    .insert({
      user_id:    userId,
      city_name:  cityName,
      title:      title || `My trip to ${cityName}`,
      start_date: startDate || null,
      end_date:   endDate || null,
    })
    .select()
    .single()
}

export async function updateItinerary(id, updates) {
  return supabase.from('itineraries').update(updates).eq('id', id)
}

export async function deleteItinerary(id) {
  return supabase.from('itineraries').delete().eq('id', id)
}

export async function addItineraryItem({ itineraryId, dayNumber, itemName, itemType, notes, timeOfDay }) {
  return supabase
    .from('itinerary_items')
    .insert({
      itinerary_id: itineraryId,
      day_number:   dayNumber,
      item_name:    itemName,
      item_type:    itemType || '',
      notes:        notes || '',
      time_of_day:  timeOfDay || 'anytime',
    })
    .select()
    .single()
}

export async function deleteItineraryItem(itemId) {
  return supabase.from('itinerary_items').delete().eq('id', itemId)
}

export async function updateItineraryItem(itemId, updates) {
  return supabase.from('itinerary_items').update(updates).eq('id', itemId)
}
