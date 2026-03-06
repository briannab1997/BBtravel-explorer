import { useState } from 'react'
import StarRating from './StarRating'
import Button from '@/components/ui/Button'
import styles from './ReviewForm.module.css'

export default function ReviewForm({ onSubmit, existing }) {
  const [rating, setRating] = useState(existing?.rating || 0)
  const [title,  setTitle]  = useState(existing?.title  || '')
  const [body,   setBody]   = useState(existing?.body   || '')
  const [busy,   setBusy]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return
    setBusy(true)
    await onSubmit({ rating, title, body })
    setBusy(false)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4 className={styles.heading}>
        {existing ? 'Update your review' : 'Share your experience'}
      </h4>

      <div className={styles.ratingRow}>
        <span className={styles.ratingLabel}>Your rating</span>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <input
        className={styles.input}
        type="text"
        placeholder="Give it a title (optional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={120}
      />

      <textarea
        className={styles.textarea}
        placeholder="Tell other travelers about this destination…"
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={4}
        maxLength={1000}
      />

      <Button type="submit" loading={busy} disabled={!rating}>
        {existing ? 'Update Review' : 'Submit Review'}
      </Button>
    </form>
  )
}
