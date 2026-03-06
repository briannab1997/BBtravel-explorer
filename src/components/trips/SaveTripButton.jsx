import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { isCitySaved, saveTrip, removeSavedTrip } from '@/services/supabase/tripsService'
import styles from './SaveTripButton.module.css'

export default function SaveTripButton({ cityName, country, wikiPhoto }) {
  const { user }          = useAuth()
  const navigate          = useNavigate()
  const [saved, setSaved] = useState(false)
  const [busy,  setBusy]  = useState(false)

  useEffect(() => {
    if (!user || !cityName) return
    isCitySaved(user.id, cityName).then(setSaved)
  }, [user, cityName])

  const toggle = async () => {
    if (!user) {
      toast('Sign in to save destinations', { icon: '🔒' })
      navigate('/signin')
      return
    }
    setBusy(true)
    if (saved) {
      await removeSavedTrip(user.id, cityName)
      setSaved(false)
      toast('Removed from wishlist', { icon: '💔' })
    } else {
      await saveTrip({ userId: user.id, cityName, country, wikiPhoto })
      setSaved(true)
      toast.success('Saved to wishlist! ❤️')
    }
    setBusy(false)
  }

  return (
    <button
      className={[styles.btn, saved ? styles.saved : ''].join(' ')}
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <span className={styles.heart}>{saved ? '❤️' : '🤍'}</span>
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  )
}
