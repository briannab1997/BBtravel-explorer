import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import PageLayout from '@/components/layout/PageLayout'
import TripCard from '@/components/trips/TripCard'
import { Skeleton } from '@/components/ui/Skeleton'
import Avatar from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useSavedTrips } from '@/hooks/useTrips'
import { useUserItineraries } from '@/hooks/useItinerary'
import { createItinerary } from '@/services/supabase/itineraryService'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { user }                        = useAuth()
  const navigate                        = useNavigate()
  const { trips, loading: tripsLoading, remove: removeTrip } = useSavedTrips()
  const { items: itin, loading: itinLoading, remove: removeItin } = useUserItineraries()
  const [tab, setTab]                   = useState('saved')
  const [planTrip, setPlanTrip]         = useState(null) // the trip to plan
  const [planTitle, setPlanTitle]       = useState('')
  const [planStart, setPlanStart]       = useState('')
  const [planEnd,   setPlanEnd]         = useState('')
  const [creating,  setCreating]        = useState(false)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler'

  const handlePlanOpen = (trip) => {
    setPlanTrip(trip)
    setPlanTitle(`My trip to ${trip.city_name}`)
    setPlanStart(''); setPlanEnd('')
  }

  const handleCreatePlan = async () => {
    if (!planTrip) return
    setCreating(true)
    const { data } = await createItinerary({
      userId: user.id, cityName: planTrip.city_name,
      title: planTitle, startDate: planStart || null, endDate: planEnd || null,
    })
    setCreating(false)
    setPlanTrip(null)
    if (data?.id) {
      toast.success('Itinerary created!')
      navigate(`/itinerary/${data.id}`)
    }
  }

  const handleRemoveTrip = async (cityName) => {
    await removeTrip(cityName)
    toast('Removed from wishlist', { icon: '🗑️' })
  }

  return (
    <PageLayout>
      <Toaster position="bottom-center" />
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <Avatar name={displayName} src={user?.user_metadata?.avatar_url} size="xl" />
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{displayName}</h1>
            <p className={styles.email}>{user?.email}</p>
            <div className={styles.stats}>
              <span className={styles.stat}><strong>{trips.length}</strong> saved</span>
              <span className={styles.statDivider}>·</span>
              <span className={styles.stat}><strong>{itin.length}</strong> itineraries</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={[styles.tab, tab === 'saved' ? styles.active : ''].join(' ')} onClick={() => setTab('saved')}>
            ❤️ Saved Destinations
            {trips.length > 0 && <span className={styles.count}>{trips.length}</span>}
          </button>
          <button className={[styles.tab, tab === 'itin' ? styles.active : ''].join(' ')} onClick={() => setTab('itin')}>
            🗓️ My Itineraries
            {itin.length > 0 && <span className={styles.count}>{itin.length}</span>}
          </button>
        </div>

        {/* Tab content */}
        {tab === 'saved' && (
          <div className={styles.content}>
            {tripsLoading ? (
              <div className={styles.grid}>
                {[...Array(4)].map((_, i) => <Skeleton key={i} height="240px" />)}
              </div>
            ) : trips.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🌍</span>
                <h3>No saved destinations yet</h3>
                <p>Explore cities and click the heart icon to save them here.</p>
                <Button onClick={() => navigate('/explore/Paris')}>Start Exploring</Button>
              </div>
            ) : (
              <div className={styles.grid}>
                {trips.map(trip => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onRemove={handleRemoveTrip}
                    onPlan={handlePlanOpen}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'itin' && (
          <div className={styles.content}>
            {itinLoading ? (
              <div className={styles.grid}>
                {[...Array(3)].map((_, i) => <Skeleton key={i} height="120px" />)}
              </div>
            ) : itin.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🗓️</span>
                <h3>No itineraries yet</h3>
                <p>Visit a destination page and click "Plan Trip" to create your first itinerary.</p>
                <Button onClick={() => navigate('/explore/Paris')}>Explore Destinations</Button>
              </div>
            ) : (
              <div className={styles.itinList}>
                {itin.map(it => (
                  <div key={it.id} className={styles.itinCard} onClick={() => navigate(`/itinerary/${it.id}`)}>
                    <div className={styles.itinInfo}>
                      <span className={styles.itinTitle}>{it.title}</span>
                      <span className={styles.itinCity}>📍 {it.city_name}</span>
                      {it.start_date && (
                        <span className={styles.itinDate}>
                          {new Date(it.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {it.end_date && ` – ${new Date(it.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </span>
                      )}
                    </div>
                    <div className={styles.itinActions}>
                      <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); navigate(`/itinerary/${it.id}`) }}>
                        Open →
                      </Button>
                      <button className={styles.delBtn} onClick={e => { e.stopPropagation(); removeItin(it.id); toast('Itinerary deleted', { icon: '🗑️' }) }} aria-label="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plan trip modal */}
      {planTrip && (
        <Modal isOpen={!!planTrip} onClose={() => setPlanTrip(null)} title={`Plan trip to ${planTrip.city_name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input style={{ border: '1.5px solid var(--color-gray-200)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--font-family)', fontSize: 14, outline: 'none', width: '100%' }} value={planTitle} onChange={e => setPlanTitle(e.target.value)} placeholder="Trip name" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--color-gray-600)', display: 'block', marginBottom: 4 }}>Start</label>
                <input type="date" style={{ border: '1.5px solid var(--color-gray-200)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--font-family)', fontSize: 14, outline: 'none', width: '100%' }} value={planStart} onChange={e => setPlanStart(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--color-gray-600)', display: 'block', marginBottom: 4 }}>End</label>
                <input type="date" style={{ border: '1.5px solid var(--color-gray-200)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--font-family)', fontSize: 14, outline: 'none', width: '100%' }} value={planEnd} onChange={e => setPlanEnd(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleCreatePlan} loading={creating} style={{ width: '100%' }}>
              Create Itinerary
            </Button>
          </div>
        </Modal>
      )}
    </PageLayout>
  )
}
