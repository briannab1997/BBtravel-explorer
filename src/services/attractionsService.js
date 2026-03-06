const INVALID_TYPES = new Set(['apartment', 'apartments', 'house', 'building', 'yes'])

const ATTRACTION_EMOJIS = {
  museum: '🖼️', gallery: '🏛️', attraction: '⭐', artwork: '🎨',
  zoo: '🦁', viewpoint: '🔭', information: 'ℹ️', hotel: '🏨',
  hostel: '🛏️', aquarium: '🐠', theme_park: '🎡', picnic_site: '🌿',
  camp_site: '⛺', caravan_site: '🚌', apartment: '🏢', wilderness_hut: '🏕️',
}

/**
 * Fetch nearby tourist attractions via OpenStreetMap Overpass API.
 * Times out after 10s (Overpass can be slow).
 */
export async function fetchAttractions(lat, lon, limit = 8) {
  try {
    const radius = 7000
    const query  = `[out:json];(
      node["tourism"](around:${radius},${lat},${lon});
      way["tourism"](around:${radius},${lat},${lon});
    );out;`

    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 10000)

    const res  = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    const data = await res.json()
    const seen = new Set()

    return data.elements
      .map(e => ({
        name:  e.tags?.name || '',
        type:  e.tags?.tourism || '',
        lat:   e.lat || null,
        lon:   e.lon || null,
        emoji: ATTRACTION_EMOJIS[e.tags?.tourism] || '📍',
      }))
      .filter(e => e.name && !INVALID_TYPES.has(e.type))
      .filter(e => {
        if (seen.has(e.name)) return false
        seen.add(e.name)
        return true
      })
      .slice(0, limit)
  } catch {
    return []
  }
}

export { ATTRACTION_EMOJIS }
