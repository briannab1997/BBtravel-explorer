import { useState } from 'react'
import Card from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import styles from './WeatherCard.module.css'

export default function WeatherCard({ weather, city, loading }) {
  const [unit, setUnit] = useState('F')

  if (loading) {
    return (
      <Card className={styles.card}>
        <Skeleton height="24px" width="140px" />
        <br />
        <Skeleton height="60px" width="120px" />
        <br />
        <Skeleton height="16px" width="180px" />
      </Card>
    )
  }

  if (!weather) return null

  const temp = unit === 'F' ? weather.tempF : weather.tempC

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Current Weather</h3>
        <span className={styles.location}>{city}</span>
      </div>

      <div className={styles.main}>
        <span className={styles.icon}>{weather.icon}</span>
        <div>
          <div className={styles.temp}>{temp}°{unit}</div>
          <div className={styles.desc}>{weather.desc}</div>
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span>💧</span>
          <span>{weather.humidity}% humidity</span>
        </div>
        <div className={styles.metaItem}>
          <span>🌬️</span>
          <span>{weather.wind} km/h wind</span>
        </div>
      </div>

      <button
        className={styles.toggle}
        onClick={() => setUnit(u => u === 'F' ? 'C' : 'F')}
      >
        Switch to °{unit === 'F' ? 'C' : 'F'}
      </button>

      {weather.forecast?.length > 0 && (
        <div className={styles.forecast}>
          <span className={styles.forecastLabel}>3-day forecast</span>
          <div className={styles.forecastDays}>
            {weather.forecast.map((day, i) => (
              <div key={i} className={styles.forecastDay}>
                <span className={styles.forecastDate}>
                  {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={styles.forecastIcon}>{weather.icon}</span>
                <span className={styles.forecastTemp}>
                  {unit === 'F' ? Math.round((day.tempC * 9/5) + 32) : day.tempC}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
