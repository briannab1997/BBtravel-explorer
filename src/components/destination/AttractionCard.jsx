import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import styles from './AttractionCard.module.css'

export default function AttractionCard({ name, type, emoji }) {
  return (
    <Card className={styles.card} hover>
      <div className={styles.emojiWrap}>
        <span className={styles.emoji}>{emoji || '📍'}</span>
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        {type && <Badge label={type.replace(/_/g, ' ')} type={type} />}
      </div>
    </Card>
  )
}
