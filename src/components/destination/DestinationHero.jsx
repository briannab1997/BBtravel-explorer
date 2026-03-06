import { Skeleton } from '@/components/ui/Skeleton'
import styles from './DestinationHero.module.css'
import { countryFlag } from '@/services/weatherService'

export default function DestinationHero({ city, country, photo, loading }) {
  if (loading) {
    return <div className={styles.skeleton}><Skeleton height="100%" /></div>
  }

  return (
    <div className={styles.hero} style={photo ? { '--bg': `url(${photo})` } : {}}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.badge}>
          {countryFlag(country)} {country}
        </div>
        <h1 className={styles.city}>{city}</h1>
      </div>
    </div>
  )
}
