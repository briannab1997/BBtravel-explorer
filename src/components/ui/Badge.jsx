import styles from './Badge.module.css'

const TYPE_COLORS = {
  museum:      'purple',
  gallery:     'blue',
  attraction:  'pink',
  artwork:     'orange',
  zoo:         'green',
  viewpoint:   'teal',
  theme_park:  'pink',
  aquarium:    'blue',
  information: 'gray',
  hotel:       'orange',
}

export default function Badge({ label, type, className = '' }) {
  const color = TYPE_COLORS[type] || 'gray'
  return (
    <span className={[styles.badge, styles[color], className].join(' ')}>
      {label || type || 'Point of Interest'}
    </span>
  )
}
