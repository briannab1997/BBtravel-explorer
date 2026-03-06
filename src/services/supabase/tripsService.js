import { supabase } from '@/lib/supabaseClient'

export async function getSavedTrips(userId) {
  return supabase
    .from('saved_trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function saveTrip({ userId, cityName, country, wikiPhoto }) {
  return supabase.from('saved_trips').upsert({
    user_id:    userId,
    city_name:  cityName,
    country:    country,
    wiki_photo: wikiPhoto,
  })
}

export async function removeSavedTrip(userId, cityName) {
  return supabase
    .from('saved_trips')
    .delete()
    .eq('user_id', userId)
    .eq('city_name', cityName)
}

export async function isCitySaved(userId, cityName) {
  const { data } = await supabase
    .from('saved_trips')
    .select('id')
    .eq('user_id', userId)
    .eq('city_name', cityName)
    .maybeSingle()
  return !!data
}
