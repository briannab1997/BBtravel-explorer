import { useState } from 'react'
import ItineraryItemCard from './ItineraryItemCard'
import AddItemModal from './AddItemModal'
import styles from './DayColumn.module.css'

const DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export default function DayColumn({ dayNumber, startDate, items = [], onAddItem, onDeleteItem, suggestions }) {
  const [modalOpen, setModal] = useState(false)

  const dateLabel = startDate
    ? new Date(new Date(startDate).getTime() + (dayNumber - 1) * 86400000)
        .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : `Day ${dayNumber}`

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <span className={styles.day}>Day {dayNumber}</span>
        <span className={styles.date}>{dateLabel}</span>
      </div>

      <div className={styles.items}>
        {items.length === 0 && (
          <div className={styles.empty}>
            <span>✈️</span>
            <span>Nothing planned yet</span>
          </div>
        )}
        {items
          .sort((a, b) => {
            const order = { morning: 0, afternoon: 1, evening: 2, anytime: 3 }
            return (order[a.time_of_day] ?? 3) - (order[b.time_of_day] ?? 3)
          })
          .map(item => (
            <ItineraryItemCard key={item.id} item={item} onDelete={onDeleteItem} />
          ))
        }
      </div>

      <button className={styles.addBtn} onClick={() => setModal(true)}>
        + Add activity
      </button>

      <AddItemModal
        isOpen={modalOpen}
        onClose={() => setModal(false)}
        onAdd={onAddItem}
        dayNumber={dayNumber}
        suggestions={suggestions}
      />
    </div>
  )
}
