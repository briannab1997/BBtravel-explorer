import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import PageLayout from '@/components/layout/PageLayout'
import DestinationHero from '@/components/destination/DestinationHero'
import WeatherCard from '@/components/destination/WeatherCard'
import CityOverview from '@/components/destination/CityOverview'
import AttractionCard from '@/components/destination/AttractionCard'
import DestinationMap from '@/components/destination/DestinationMap'
import SaveTripButton from '@/components/trips/SaveTripButton'
import ReviewCard from '@/components/reviews/ReviewCard'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'
import { geocodeCity } from '@/services/geoService'
import { fetchWeather } from '@/services/weatherService'
import { fetchWikiData } from '@/services/wikiService'
import { fetchAttractions } from '@/services/attractionsService'
import { getReviewsForCity, getCityStats } from '@/services/supabase/reviewsService'
import { createItinerary } from '@/services/supabase/itineraryService'
import StarRating from '@/components/reviews/StarRating'
import styles from './ExplorePage.module.css'

export default function ExplorePage() {
  const { city: cityParam }  = useParams()
  const city = decodeURIComponent(cityParam || '')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [geo,          setGeo]         = useState(null)
  const [weather,      setWeather]      = useState(null)
  const [wiki,         setWiki]         = useState(null)
  const [attractions,  setAttractions]  = useState([])
  const [reviews,      setReviews]      = useState([])
  const [stats,        setStats]        = useState({ average: 0, count: 0 })
  const [loadingData,  setLoadingData]  = useState(true)
  const [planModal,    setPlanModal]    = useState(false)
  const [planTitle,    setPlanTitle]    = useState('')
  const [planStart,    setPlanStart]    = useState('')
  const [planEnd,      setPlanEnd]      = useState('')
  const [creating,     setCreating]     = useState(false)

  useEffect(() => {
    if (!city) return
    setLoadingData(true)
    setGeo(null); setWeather(null); setWiki(null); setAttractions([]); setReviews([])

    async function loadAll() {
      const place = await geocodeCity(city)
      if (!place) { setLoadingData(false); return }
      setGeo(place)

      // Load all data in parallel
      const [wData, weath, attr, revData, statsData] = await Promise.all([
        fetchWikiData(city),
        fetchWeather(place.lat, place.lon),
        fetchAttractions(place.lat, place.lon),
        getReviewsForCity(city, { pageSize: 3 }),
        getCityStats(city),
      ])
      setWiki(wData)
      setWeather(weath)
      setAttractions(attr)
      setReviews(revData.data || [])
      setStats(statsData)
      setLoadingData(false)
    }
    loadAll()
  }, [city])

  const handlePlanTrip = async () => {
    if (!user) { navigate('/signin'); return }
    setCreating(true)
    const { data } = await createItinerary({
      userId:    user.id,
      cityName:  city,
      title:     planTitle || `My trip to ${city}`,
      startDate: planStart || null,
      endDate:   planEnd   || null,
    })
    setCreating(false)
    setPlanModal(false)
    if (data?.id) {
      toast.success('Itinerary created!')
      navigate(`/itinerary/${data.id}`)
    }
  }

  return (
    <PageLayout>
      <Toaster position="bottom-center" />
      <div className={styles.page}>
        <DestinationHero
          city={geo?.name || city}
          country={geo?.country}
          photo={wiki?.photo}
          loading={loadingData}
        />

        {/* Action bar */}
        <div className={styles.actionBar}>
          <SaveTripButton cityName={city} country={geo?.country} wikiPhoto={wiki?.photo} />
          <Button variant="outline" size="sm" onClick={() => {
            if (!user) { navigate('/signin'); return }
            setPlanModal(true)
          }}>
            🗓️ Plan Trip
          </Button>
          <Link to={`/reviews/${encodeURIComponent(city)}`}>
            <Button variant="ghost" size="sm">
              {stats.count > 0 ? `⭐ ${stats.average} (${stats.count} reviews)` : '✏️ Write a Review'}
            </Button>
          </Link>
        </div>

        {/* Main content grid */}
        <div className={styles.grid}>
          {/* Left column */}
          <div className={styles.left}>
            <WeatherCard weather={weather} city={city} loading={loadingData} />
            <CityOverview city={geo?.name || city} description={wiki?.description} loading={loadingData} />

            {/* Reviews preview */}
            {reviews.length > 0 && (
              <div className={styles.reviewsPreview}>
                <div className={styles.reviewsHeader}>
                  <h3>Traveler Reviews</h3>
                  <StarRating value={Math.round(stats.average)} readOnly size="sm" />
                  <span className={styles.reviewCount}>{stats.count} reviews</span>
                </div>
                {reviews.slice(0, 2).map(r => (
                  <ReviewCard key={r.id} review={r} />
                ))}
                <Link to={`/reviews/${encodeURIComponent(city)}`}>
                  <Button variant="outline" size="sm" style={{ marginTop: '8px' }}>
                    See all reviews →
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className={styles.right}>
            {loadingData ? (
              <div className={styles.attractSkeleton}>
                {[...Array(4)].map((_, i) => <Skeleton key={i} height="70px" />)}
              </div>
            ) : attractions.length > 0 ? (
              <div className={styles.attractions}>
                <h3 className={styles.sectionTitle}>City Highlights</h3>
                <div className={styles.attractGrid}>
                  {attractions.map((a, i) => (
                    <AttractionCard key={i} name={a.name} type={a.type} emoji={a.emoji} />
                  ))}
                </div>
              </div>
            ) : null}

            {geo && (
              <DestinationMap
                lat={geo.lat}
                lon={geo.lon}
                city={geo.name || city}
                attractions={attractions}
              />
            )}
          </div>
        </div>
      </div>

      {/* Plan trip modal */}
      <Modal isOpen={planModal} onClose={() => setPlanModal(false)} title={`Plan your trip to ${city}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>
              Trip name
            </label>
            <input
              style={{ width: '100%', border: '1.5px solid var(--color-gray-200)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--font-family)', fontSize: 14, outline: 'none' }}
              placeholder={`My trip to ${city}`}
              value={planTitle}
              onChange={e => setPlanTitle(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>Start date</label>
              <input type="date" style={{ width: '100%', border: '1.5px solid var(--color-gray-200)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--font-family)', fontSize: 14, outline: 'none' }} value={planStart} onChange={e => setPlanStart(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>End date</label>
              <input type="date" style={{ width: '100%', border: '1.5px solid var(--color-gray-200)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--font-family)', fontSize: 14, outline: 'none' }} value={planEnd} onChange={e => setPlanEnd(e.target.value)} />
            </div>
          </div>
          <Button onClick={handlePlanTrip} loading={creating} style={{ width: '100%' }}>
            Create Itinerary
          </Button>
        </div>
      </Modal>
    </PageLayout>
  )
}
