import Card from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import styles from './CityOverview.module.css'

export default function CityOverview({ city, description, loading }) {
  if (loading) {
    return (
      <Card className={styles.card}>
        <Skeleton height="24px" width="160px" />
        <br />
        <Skeleton height="14px" />
        <Skeleton height="14px" width="95%" />
        <Skeleton height="14px" width="88%" />
        <Skeleton height="14px" width="92%" />
      </Card>
    )
  }

  if (!description) return null

  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>About {city}</h3>
      <p className={styles.text}>{description}</p>
    </Card>
  )
}
