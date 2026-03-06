import styles from './AutocompleteDropdown.module.css'

export default function AutocompleteDropdown({ suggestions, onSelect, loading }) {
  if (!loading && !suggestions.length) return null

  return (
    <div className={styles.dropdown}>
      {loading && (
        <div className={styles.loading}>
          <span className={styles.spinner} />
          <span>Searching cities…</span>
        </div>
      )}
      {suggestions.map((s, i) => (
        <button key={i} className={styles.item} onClick={() => onSelect(s)}>
          <span className={styles.cityName}>{s.city}</span>
          <span className={styles.region}>{s.region && `${s.region}, `}{s.country}</span>
        </button>
      ))}
    </div>
  )
}
