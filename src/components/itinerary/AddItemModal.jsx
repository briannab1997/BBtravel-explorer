import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import styles from './AddItemModal.module.css'

const TIME_OPTIONS = ['morning', 'afternoon', 'evening', 'anytime']
const TYPE_OPTIONS = ['attraction', 'museum', 'gallery', 'restaurant', 'viewpoint', 'park', 'shopping', 'other']

export default function AddItemModal({ isOpen, onClose, onAdd, dayNumber, suggestions = [] }) {
  const [name,     setName]    = useState('')
  const [type,     setType]    = useState('attraction')
  const [timeSlot, setTime]    = useState('anytime')
  const [notes,    setNotes]   = useState('')
  const [busy,     setBusy]    = useState(false)

  const handleAdd = async () => {
    if (!name.trim()) return
    setBusy(true)
    await onAdd({ dayNumber, itemName: name, itemType: type, timeOfDay: timeSlot, notes })
    setName(''); setType('attraction'); setTime('anytime'); setNotes('')
    setBusy(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add to Day ${dayNumber}`}>
      <div className={styles.body}>
        {suggestions.length > 0 && (
          <div className={styles.suggestions}>
            <p className={styles.suggestLabel}>Quick add from city attractions:</p>
            <div className={styles.chips}>
              {suggestions.map((s, i) => (
                <button key={i} className={styles.chip} onClick={() => { setName(s.name); setType(s.type) }}>
                  {s.emoji} {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Activity name *</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. Visit the Louvre, Lunch at a café…"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <select className={styles.select} value={type} onChange={e => setType(e.target.value)}>
              {TYPE_OPTIONS.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Time of day</label>
            <select className={styles.select} value={timeSlot} onChange={e => setTime(e.target.value)}>
              {TIME_OPTIONS.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notes (optional)</label>
          <textarea
            className={styles.textarea}
            placeholder="Any details, address, or reminders…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <Button onClick={handleAdd} loading={busy} disabled={!name.trim()} style={{ width: '100%' }}>
          Add to Itinerary
        </Button>
      </div>
    </Modal>
  )
}
