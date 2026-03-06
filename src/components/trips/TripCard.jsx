import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import styles from './TripCard.module.css'

export default function TripCard({ trip, onRemove, onPlan }) {
  const date = trip.created_at
    ? new Date(trip.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <Card className={styles.card} hover>
      <div
        className={styles.photo}
        style={trip.wiki_photo ? { backgroundImage: `url(${trip.wiki_photo})` } : {}}
      >
        <div className={styles.photoOverlay} />
        <span className={styles.cityName}>{trip.city_name}</span>
        {trip.country && <span className={styles.country}>{trip.country}</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.date}>Saved {date}</span>
        </div>

        <div className={styles.actions}>
          <Button size="sm" variant="primary" onClick={() => onPlan(trip)}>
            Plan Trip
          </Button>
          <Link to={`/explore/${encodeURIComponent(trip.city_name)}`}>
            <Button size="sm" variant="outline">Explore</Button>
          </Link>
          <button className={styles.remove} onClick={() => onRemove(trip.city_name)} aria-label="Remove">
            🗑️
          </button>
        </div>
      </div>
    </Card>
  )
}
