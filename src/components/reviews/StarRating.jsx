import styles from './StarRating.module.css'

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }) {
  return (
    <div className={[styles.stars, styles[size]].join(' ')}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          className={[styles.star, n <= value ? styles.filled : styles.empty].join(' ')}
          onClick={() => !readOnly && onChange?.(n)}
          disabled={readOnly}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
