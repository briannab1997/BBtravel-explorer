/**
 * Fetch city photo + description from Wikipedia in a single API call.
 */
export async function fetchWikiData(city) {
  try {
    const res  = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`
    )
    const data = await res.json()

    // Reject disambiguation pages
    if (data.description?.toLowerCase().includes('may refer')) {
      return { photo: null, description: 'No description available.' }
    }

    return {
      photo:       data.originalimage?.source || data.thumbnail?.source || null,
      description: data.extract || 'No description available.',
    }
  } catch {
    return { photo: null, description: 'No description available.' }
  }
}
