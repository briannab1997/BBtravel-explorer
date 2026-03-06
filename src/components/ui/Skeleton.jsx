import styles from './Skeleton.module.css'

export function Skeleton({ width, height, borderRadius, className = '' }) {
  return (
    <span
      className={[styles.skeleton, 'skeleton', className].join(' ')}
      style={{ width, height, borderRadius, display: 'block' }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton height="180px" />
      <div className={styles.content}>
        <Skeleton height="20px" width="70%" />
        <Skeleton height="14px" width="45%" />
        <Skeleton height="14px" width="90%" />
        <Skeleton height="14px" width="80%" />
      </div>
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div className={styles.skeletonHero}>
      <Skeleton height="100%" />
    </div>
  )
}
