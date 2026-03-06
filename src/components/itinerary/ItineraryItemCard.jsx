import Badge from '@/components/ui/Badge'
import { ATTRACTION_EMOJIS } from '@/services/attractionsService'
import styles from './ItineraryItemCard.module.css'

const TIME_LABELS = { morning: '🌅 Morning', afternoon: '☀️ Afternoon', evening: '🌆 Evening', anytime: '📅 Anytime' }

export default function ItineraryItemCard({ item, onDelete }) {
  return (
    <div className={styles.card}>
      <span className={styles.emoji}>{ATTRACTION_EMOJIS[item.item_type] || '📍'}</span>
      <div className={styles.info}>
        <span className={styles.name}>{item.item_name}</span>
        <div className={styles.tags}>
          {item.time_of_day && (
            <span className={styles.time}>{TIME_LABELS[item.time_of_day] || item.time_of_day}</span>
          )}
          {item.item_type && <Badge label={item.item_type.replace(/_/g, ' ')} type={item.item_type} />}
        </div>
        {item.notes && <p className={styles.notes}>{item.notes}</p>}
      </div>
      <button className={styles.del} onClick={() => onDelete(item.id)} aria-label="Remove">✕</button>
    </div>
  )
}
