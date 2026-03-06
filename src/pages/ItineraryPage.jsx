import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import PageLayout from '@/components/layout/PageLayout'
import DayColumn from '@/components/itinerary/DayColumn'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSingleItinerary } from '@/hooks/useItinerary'
import { useEffect } from 'react'
import { fetchAttractions } from '@/services/attractionsService'
import { geocodeCity } from '@/services/geoService'
import styles from './ItineraryPage.module.css'

function getDayCount(startDate, endDate) {
  if (!startDate || !endDate) return 3
  const start = new Date(startDate)
  const end   = new Date(endDate)
  const diff  = Math.round((end - start) / 86400000) + 1
  return Math.max(1, Math.min(diff, 14))
}

export default function ItineraryPage() {
  const { tripId } = useParams()
  const { data: itin, loading, addItem, removeItem } = useSingleItinerary(tripId)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (!itin?.city_name) return
    geocodeCity(itin.city_name).then(geo => {
      if (geo) fetchAttractions(geo.lat, geo.lon, 12).then(setSuggestions)
    })
  }, [itin?.city_name])

  if (loading) {
    return (
      <PageLayout>
        <div className={styles.page}>
          <Skeleton height="40px" width="300px" />
          <br />
          <div className={styles.columns}>
            {[1,2,3].map(i => <Skeleton key={i} height="400px" />)}
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!itin) {
    return (
      <PageLayout>
        <div className={styles.page}>
          <div className={styles.notFound}>
            <span>🗓️</span>
            <h2>Itinerary not found</h2>
            <Link to="/dashboard">← Back to dashboard</Link>
          </div>
        </div>
      </PageLayout>
    )
  }

  const dayCount = getDayCount(itin.start_date, itin.end_date)
  const days = Array.from({ length: dayCount }, (_, i) => i + 1)

  const handleAddItem = async (payload) => {
    await addItem(payload)
    toast.success('Activity added!')
  }

  const handleDeleteItem = async (itemId) => {
    await removeItem(itemId)
    toast('Removed from itinerary', { icon: '🗑️' })
  }

  return (
    <PageLayout>
      <Toaster position="bottom-center" />
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <Link to="/dashboard" className={styles.back}>← My Trips</Link>
            <h1 className={styles.title}>{itin.title}</h1>
            <p className={styles.meta}>
              📍 {itin.city_name}
              {itin.start_date && (
                <> · {new Date(itin.start_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                {itin.end_date && ` – ${new Date(itin.end_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                </>
              )}
              · {dayCount} day{dayCount > 1 ? 's' : ''}
            </p>
          </div>
          <Link to={`/explore/${encodeURIComponent(itin.city_name)}`} className={styles.exploreLink}>
            Explore {itin.city_name} →
          </Link>
        </div>

        <div className={styles.columns}>
          {days.map(day => (
            <DayColumn
              key={day}
              dayNumber={day}
              startDate={itin.start_date}
              items={itin.itinerary_items?.filter(i => i.day_number === day) || []}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              suggestions={suggestions}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
