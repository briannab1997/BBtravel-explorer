import Avatar from '@/components/ui/Avatar'
import StarRating from './StarRating'
import styles from './ReviewCard.module.css'

export default function ReviewCard({ review, onDelete, isOwner }) {
  const { profiles: profile } = review
  const name = profile?.display_name || 'Traveler'
  const date = review.created_at
    ? new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : ''

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Avatar src={profile?.avatar_url} name={name} size="sm" />
        <div className={styles.meta}>
          <span className={styles.name}>{name}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <StarRating value={review.rating} readOnly size="sm" />
        {isOwner && (
          <button className={styles.del} onClick={onDelete} aria-label="Delete review">🗑️</button>
        )}
      </div>
      {review.title && <h4 className={styles.title}>{review.title}</h4>}
      {review.body  && <p  className={styles.body}>{review.body}</p>}
    </div>
  )
}
