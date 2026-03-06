/**
 * City autocomplete via GeoDB Cities (free tier).
 * Rate limit: ~1 req/sec — always debounce before calling.
 */
export async function fetchCitySuggestions(query) {
  if (!query || query.length < 2) return []
  try {
    const params = new URLSearchParams({ namePrefix: query, limit: 8, sort: '-population' })
    const res = await fetch(
      `https://geodb-free-service.wirefreethought.com/v1/geo/cities?${params}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.data || []).map(item => ({
      label:   `${item.city}, ${item.region}, ${item.country}`,
      city:    item.city,
      region:  item.region,
      country: item.country,
    }))
  } catch {
    return []
  }
}

/**
 * Geocode a city name to lat/lon using Nominatim.
 * Tries several query variations for best accuracy.
 */
export async function geocodeCity(city, country = '') {
  const attempts = country
    ? [`${city}, ${country}`, city]
    : [city]

  for (const q of attempts) {
    try {
      const params = new URLSearchParams({ q, format: 'json', addressdetails: 1, limit: 1 })
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { 'User-Agent': 'TravelExplorerApp', 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data.length) {
        return {
          name:    data[0].display_name.split(',')[0].trim(),
          lat:     parseFloat(data[0].lat),
          lon:     parseFloat(data[0].lon),
          country: data[0].address?.country || country,
        }
      }
    } catch {
      continue
    }
  }
  return null
}
