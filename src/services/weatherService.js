/**
 * Fetch current weather from Open-Meteo (free, no API key).
 * Note: API returns temperature in °C directly.
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude:  lat,
    longitude: lon,
    current:   'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m',
    hourly:    'temperature_2m,weather_code',
    forecast_days: 3,
  })
  const res  = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  const data = await res.json()

  const tempC = data.current.temperature_2m
  const code  = data.current.weather_code

  // Build a simple 3-day forecast from hourly data (noon reading each day)
  const forecast = []
  const hours    = data.hourly?.time || []
  for (let day = 0; day < 3; day++) {
    const noonIdx = hours.findIndex(t => t.includes(`T12:00`) && new Date(t).getDate() === new Date(Date.now() + day * 86400000).getDate())
    if (noonIdx >= 0) {
      forecast.push({
        date:  hours[noonIdx].split('T')[0],
        tempC: Math.round(data.hourly.temperature_2m[noonIdx]),
        code:  data.hourly.weather_code[noonIdx],
      })
    }
  }

  return {
    tempC:    Math.round(tempC),
    tempF:    Math.round((tempC * 9) / 5 + 32),
    desc:     weatherDesc(code),
    icon:     weatherIcon(code),
    humidity: data.current.relative_humidity_2m,
    wind:     Math.round(data.current.wind_speed_10m),
    forecast,
  }
}

function weatherDesc(code) {
  const m = {
    0: 'Clear Sky',  1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Icy Fog',
    51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
    80: 'Rain Showers', 81: 'Heavy Showers',
    95: 'Thunderstorm', 99: 'Severe Thunderstorm',
  }
  return m[code] || 'Unknown'
}

export function weatherIcon(code) {
  if (code === 0)              return '☀️'
  if (code <= 2)               return '🌤️'
  if (code === 3)              return '☁️'
  if (code <= 48)              return '🌫️'
  if (code <= 55)              return '🌦️'
  if (code <= 65)              return '🌧️'
  if (code <= 75)              return '❄️'
  if (code <= 82)              return '🌦️'
  if (code >= 95)              return '⛈️'
  return '🌍'
}

export function countryFlag(countryName) {
  const flags = {
    'United States': '🇺🇸', 'Canada': '🇨🇦', 'Mexico': '🇲🇽',
    'France': '🇫🇷', 'Germany': '🇩🇪', 'Italy': '🇮🇹', 'Spain': '🇪🇸',
    'Australia': '🇦🇺', 'United Kingdom': '🇬🇧', 'Ireland': '🇮🇪',
    'Brazil': '🇧🇷', 'Japan': '🇯🇵', 'China': '🇨🇳', 'India': '🇮🇳',
    'South Korea': '🇰🇷', 'Thailand': '🇹🇭', 'Indonesia': '🇮🇩',
    'Netherlands': '🇳🇱', 'Portugal': '🇵🇹', 'Greece': '🇬🇷',
    'Turkey': '🇹🇷', 'Egypt': '🇪🇬', 'South Africa': '🇿🇦',
    'Argentina': '🇦🇷', 'Chile': '🇨🇱', 'Colombia': '🇨🇴',
    'Peru': '🇵🇪', 'New Zealand': '🇳🇿', 'Sweden': '🇸🇪',
    'Norway': '🇳🇴', 'Denmark': '🇩🇰', 'Switzerland': '🇨🇭',
    'Austria': '🇦🇹', 'Belgium': '🇧🇪', 'Poland': '🇵🇱',
    'Czech Republic': '🇨🇿', 'Hungary': '🇭🇺', 'Romania': '🇷🇴',
    'Russia': '🇷🇺', 'Ukraine': '🇺🇦', 'Morocco': '🇲🇦',
    'United Arab Emirates': '🇦🇪', 'Saudi Arabia': '🇸🇦',
    'Singapore': '🇸🇬', 'Malaysia': '🇲🇾', 'Vietnam': '🇻🇳',
    'Philippines': '🇵🇭', 'Pakistan': '🇵🇰', 'Bangladesh': '🇧🇩',
  }
  return flags[countryName] || '🌍'
}
