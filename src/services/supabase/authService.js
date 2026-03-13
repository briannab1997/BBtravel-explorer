import { getTable, setTable, uid, now, ok, fail, getSession, setSession } from '@/lib/mockDb'

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp({ email, password, fullName }) {
  const users = getTable('users')
  if (users.find(u => u.email === email)) {
    return fail('User already registered')
  }
  const user = {
    id: uid(),
    email,
    password, // demo only — never store plaintext in a real app
    user_metadata: { full_name: fullName },
    created_at: now(),
  }
  setTable('users', [...users, user])

  // Also create a profile row
  const profiles = getTable('profiles')
  setTable('profiles', [...profiles, {
    id:           user.id,
    display_name: fullName || email.split('@')[0],
    avatar_url:   null,
  }])

  const { password: _pw, ...safeUser } = user
  setSession(safeUser)
  return ok({ user: safeUser, session: { user: safeUser } })
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signIn({ email, password }) {
  const users = getTable('users')
  const user  = users.find(u => u.email === email && u.password === password)
  if (!user) return fail('Invalid login credentials')

  const { password: _pw, ...safeUser } = user
  setSession(safeUser)
  return ok({ user: safeUser, session: { user: safeUser } })
}

// ─── Google OAuth (mock — signs in as a demo Google user) ────────────────────

export async function signInWithGoogle() {
  const googleUser = {
    id:            'google-demo-user',
    email:         'demo@gmail.com',
    user_metadata: { full_name: 'Demo User' },
    created_at:    now(),
  }

  // Ensure a profile exists
  const profiles = getTable('profiles')
  if (!profiles.find(p => p.id === googleUser.id)) {
    setTable('profiles', [...profiles, {
      id:           googleUser.id,
      display_name: 'Demo User',
      avatar_url:   null,
    }])
  }

  setSession(googleUser)
  // Simulate redirect by navigating to /dashboard
  window.location.href = `${window.location.origin}/dashboard`
  return ok({ user: googleUser })
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut() {
  setSession(null)
  return ok(null)
}

// ─── Password Reset (no-op in demo) ──────────────────────────────────────────

export async function resetPassword(email) {
  console.info('[mock] Password reset email would be sent to', email)
  return ok(null)
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(userId) {
  const profiles = getTable('profiles')
  const profile  = profiles.find(p => p.id === userId)
  return profile ? ok(profile) : fail('Profile not found')
}

export async function updateProfile(userId, updates) {
  const profiles = getTable('profiles')
  const idx      = profiles.findIndex(p => p.id === userId)
  if (idx === -1) return fail('Profile not found')

  profiles[idx] = { ...profiles[idx], ...updates }
  setTable('profiles', profiles)
  return ok(profiles[idx])
}
