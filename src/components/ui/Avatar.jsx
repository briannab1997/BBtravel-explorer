import styles from './Avatar.module.css'

export default function Avatar({ src, name, size = 'md', className = '' }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className={[styles.avatar, styles[size], className].join(' ')}>
      {src
        ? <img src={src} alt={name || 'Avatar'} />
        : <span className={styles.initials}>{initials}</span>
      }
    </div>
  )
}
