/**
 * mockDb.js — lightweight localStorage backend for portfolio demo.
 * All functions return { data, error } to match the Supabase client shape
 * so no component code needs to change.
 */

const PREFIX = 'jetset_'

export function getTable(name) {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + name) || '[]')
  } catch {
    return []
  }
}

export function setTable(name, rows) {
  localStorage.setItem(PREFIX + name, JSON.stringify(rows))
}

export function uid() {
  return crypto.randomUUID()
}

export function now() {
  return new Date().toISOString()
}

/** Wrap a value in Supabase-style { data, error } */
export function ok(data) {
  return { data, error: null }
}

export function fail(message) {
  return { data: null, error: { message } }
}

// ─── Auth session helpers ────────────────────────────────────────────────────

const SESSION_KEY = PREFIX + 'session'

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) ?? null
  } catch {
    return null
  }
}

export function setSession(user) {
  if (user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    sessionStorage.removeItem(SESSION_KEY)
  }
  window.dispatchEvent(new CustomEvent('mockAuthChange', { detail: user }))
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_KEY = PREFIX + 'seeded'

export function seedIfNeeded() {
  if (localStorage.getItem(SEED_KEY)) return

  const seedUserId = 'seed-user-001'

  // Seed profiles
  setTable('profiles', [
    { id: seedUserId,       display_name: 'Mia Chen',       avatar_url: null },
    { id: 'seed-user-002',  display_name: 'James Okafor',   avatar_url: null },
    { id: 'seed-user-003',  display_name: 'Lucia Fernández', avatar_url: null },
    { id: 'seed-user-004',  display_name: 'Ren Tanaka',     avatar_url: null },
  ])

  // Seed reviews
  setTable('reviews', [
    {
      id: uid(), user_id: seedUserId, city_name: 'Paris',
      rating: 5, title: 'City of Light lives up to every expectation',
      body: 'The architecture alone is worth the trip — wandering past Notre-Dame at sunrise is unforgettable. The food scene goes so far beyond croissants. Highly recommend the Marais neighbourhood for hidden gems.',
      visited_at: '2025-09-01', created_at: '2025-09-15T10:00:00Z',
      profiles: { display_name: 'Mia Chen', avatar_url: null },
    },
    {
      id: uid(), user_id: 'seed-user-002', city_name: 'Paris',
      rating: 4, title: 'Magical but crowded in summer',
      body: 'Go in spring or autumn if you can. The Musée d\'Orsay blew me away — better than the Louvre for my taste. Metro is easy to navigate.',
      visited_at: '2025-07-20', created_at: '2025-08-01T08:30:00Z',
      profiles: { display_name: 'James Okafor', avatar_url: null },
    },
    {
      id: uid(), user_id: 'seed-user-003', city_name: 'Tokyo',
      rating: 5, title: 'The most organised, vibrant city I\'ve ever visited',
      body: 'Everything works perfectly — trains, food, people. Shibuya Crossing at night is electric. Street food in Asakusa was incredible. Already planning to return.',
      visited_at: '2025-11-10', created_at: '2025-11-28T14:00:00Z',
      profiles: { display_name: 'Lucia Fernández', avatar_url: null },
    },
    {
      id: uid(), user_id: 'seed-user-004', city_name: 'Tokyo',
      rating: 5, title: 'A dream for food lovers',
      body: 'I ate ramen, sushi, and yakitori every single day and never repeated a spot. Explore beyond the tourist areas — Shimokitazawa has amazing vintage shops and live music.',
      visited_at: '2025-10-05', created_at: '2025-10-20T09:15:00Z',
      profiles: { display_name: 'Ren Tanaka', avatar_url: null },
    },
    {
      id: uid(), user_id: 'seed-user-002', city_name: 'Barcelona',
      rating: 5, title: 'Art, beaches, and incredible food',
      body: 'Gaudí\'s work is genuinely mind-bending in person — La Sagrada Família left me speechless. The Gothic Quarter is endlessly photogenic. Tapas and vermouth at noon is the only way to live.',
      visited_at: '2025-06-14', created_at: '2025-06-30T11:00:00Z',
      profiles: { display_name: 'James Okafor', avatar_url: null },
    },
    {
      id: uid(), user_id: 'seed-user-003', city_name: 'New York',
      rating: 4, title: 'Overwhelming in the best possible way',
      body: 'There\'s genuinely nothing else like it. Central Park, MOMA, the High Line, the food scene — you could visit a dozen times and barely scratch the surface. Just budget carefully!',
      visited_at: '2025-04-18', created_at: '2025-05-02T16:00:00Z',
      profiles: { display_name: 'Lucia Fernández', avatar_url: null },
    },
    {
      id: uid(), user_id: seedUserId, city_name: 'Kyoto',
      rating: 5, title: 'Peaceful, timeless, and utterly beautiful',
      body: 'Fushimi Inari at 6 am before the crowds arrive — that\'s the move. The bamboo grove in Arashiyama and a traditional tea ceremony rounded out a perfect trip. Japan stole my heart.',
      visited_at: '2025-03-25', created_at: '2025-04-05T07:00:00Z',
      profiles: { display_name: 'Mia Chen', avatar_url: null },
    },
    {
      id: uid(), user_id: 'seed-user-004', city_name: 'Rome',
      rating: 5, title: 'History on every single corner',
      body: 'Standing inside the Pantheon or tossing a coin in the Trevi Fountain never gets old. The pasta is life-changing. Book the Vatican Museums in advance — the queue otherwise is brutal.',
      visited_at: '2025-05-02', created_at: '2025-05-18T13:30:00Z',
      profiles: { display_name: 'Ren Tanaka', avatar_url: null },
    },
  ])

  localStorage.setItem(SEED_KEY, '1')
}
