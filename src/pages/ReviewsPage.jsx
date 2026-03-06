import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import PageLayout from '@/components/layout/PageLayout'
import ReviewForm from '@/components/reviews/ReviewForm'
import ReviewCard from '@/components/reviews/ReviewCard'
import StarRating from '@/components/reviews/StarRating'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useCityReviews } from '@/hooks/useReviews'
import styles from './ReviewsPage.module.css'

export default function ReviewsPage() {
  const { city: cityParam } = useParams()
  const city = decodeURIComponent(cityParam || '')
  const { user } = useAuth()
  const { reviews, stats, userReview, loading, submit, remove } = useCityReviews(city)

  const handleSubmit = async (data) => {
    const ok = await submit(data)
    if (ok) toast.success(userReview ? 'Review updated!' : 'Review submitted! ⭐')
    else toast.error('Something went wrong.')
  }

  const handleDelete = async (id) => {
    await remove(id)
    toast('Review deleted', { icon: '🗑️' })
  }

  return (
    <PageLayout>
      <Toaster position="bottom-center" />
      <div className={styles.page}>
        <div className={styles.header}>
          <Link to={`/explore/${encodeURIComponent(city)}`} className={styles.back}>
            ← Back to {city}
          </Link>
          <h1 className={styles.title}>Reviews for {city}</h1>
          {stats.count > 0 && (
            <div className={styles.statsRow}>
              <span className={styles.avg}>{stats.average}</span>
              <StarRating value={Math.round(stats.average)} readOnly size="lg" />
              <span className={styles.count}>{stats.count} review{stats.count !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className={styles.grid}>
          <div className={styles.formCol}>
            {user ? (
              <ReviewForm onSubmit={handleSubmit} existing={userReview} />
            ) : (
              <div className={styles.signInCta}>
                <span>🔒</span>
                <p>Sign in to share your experience with other travelers.</p>
                <Link to="/signin"><Button size="sm">Sign In to Review</Button></Link>
              </div>
            )}
          </div>

          <div className={styles.reviewsCol}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...Array(3)].map((_, i) => <Skeleton key={i} height="100px" />)}
              </div>
            ) : reviews.length === 0 ? (
              <div className={styles.noReviews}>
                <span>✈️</span>
                <h3>No reviews yet for {city}</h3>
                <p>Be the first to share your experience!</p>
              </div>
            ) : (
              <div className={styles.reviewList}>
                {reviews.map(r => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    isOwner={user?.id === r.user_id}
                    onDelete={() => handleDelete(r.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
