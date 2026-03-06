import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import PageLayout from '@/components/layout/PageLayout'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { getProfile, updateProfile } from '@/services/supabase/authService'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [username,    setUsername]    = useState('')
  const [bio,         setBio]         = useState('')
  const [saving,      setSaving]      = useState(false)

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then(({ data }) => {
      if (data) {
        setProfile(data)
        setDisplayName(data.display_name || user.user_metadata?.full_name || '')
        setUsername(data.username || '')
        setBio(data.bio || '')
      }
    })
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await updateProfile(user.id, { display_name: displayName, username, bio })
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Profile updated!')
  }

  return (
    <PageLayout>
      <Toaster position="bottom-center" />
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <Avatar name={displayName || user?.email} src={user?.user_metadata?.avatar_url} size="xl" />
            <div>
              <h2 className={styles.name}>{displayName || 'Your Account'}</h2>
              <p className={styles.email}>{user?.email}</p>
            </div>
          </div>

          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Display name</label>
              <input className={styles.input} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <div className={styles.inputPrefix}>
                <span className={styles.prefix}>@</span>
                <input className={styles.input} value={username} onChange={e => setUsername(e.target.value.replace(/[^a-z0-9_]/g, ''))} placeholder="username" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Bio</label>
              <textarea className={styles.textarea} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell other travelers a little about yourself…" rows={3} maxLength={300} />
            </div>
            <Button onClick={handleSave} loading={saving}>Save Changes</Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
