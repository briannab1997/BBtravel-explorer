# ✈️ Travel Explorer

A full-stack travel platform built with **React**, **Vite**, and **Supabase** — search any city in the world, plan your trip, save favorites, and read real traveler reviews.

> Built by **Brianna Brockington** · Frontend Developer · Software Engineer

---

## 🚀 Features

- 🔍 **Smart City Search** — Autocomplete powered by GeoDB Cities API
- 🌤️ **Live Weather** — Real-time conditions + 3-day forecast, °F/°C toggle
- 📸 **City Photos & Overview** — Wikipedia API integration
- 🏛️ **Nearby Attractions** — OpenStreetMap Overpass API with category badges
- 🗺️ **Interactive Map** — Leaflet.js with attraction markers
- ❤️ **Wishlist** — Save destinations to your account (Supabase)
- 🗓️ **Trip Planner** — Build a day-by-day itinerary for any destination
- ⭐ **Destination Reviews** — Read and write reviews for any city
- 🔐 **Auth** — Email/password + Google OAuth via Supabase Auth
- 👤 **User Profile** — Manage your account and bio
- 🌙 **Dark Mode** — Persisted across sessions
- 📱 **Fully Responsive** — Mobile-first design

---

## 🛠️ Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 18, Vite, React Router v7 |
| Backend    | Supabase (Auth + PostgreSQL) |
| Styling    | CSS Modules + CSS Custom Properties |
| State      | React Query (@tanstack/react-query) |
| Map        | Leaflet.js + react-leaflet |
| APIs       | Open-Meteo, Wikipedia REST, Overpass, Nominatim, GeoDB |
| Toasts     | react-hot-toast |

---

## ⚙️ Setup

### 1. Clone and install

```bash
git clone https://github.com/briannab1997/BBtravel-explorer.git
cd BBtravel-explorer
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → create a free account → **New Project**
2. Go to **Project Settings → API** → copy your **Project URL** and **anon public key**
3. In **Authentication → Settings** → disable **Enable email confirmations** (for development)
4. In **SQL Editor**, run the schema in `supabase/schema.sql`

### 3. Create `.env.local`

```bash
cp .env.example .env.local
```

Then fill in your values:

```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🗄️ Database Schema

See [`supabase/schema.sql`](./supabase/schema.sql) for the full schema including:
- `profiles` — auto-created on signup via trigger
- `saved_trips` — user wishlist
- `itineraries` + `itinerary_items` — trip planner
- `reviews` — destination reviews with RLS policies

---

## 📂 Project Structure

```
src/
├── context/        AuthContext (global auth state)
├── lib/            supabaseClient singleton
├── services/       API service modules
│   └── supabase/   Supabase CRUD services
├── hooks/          Custom React hooks
├── components/
│   ├── layout/     Navbar, Footer, PageLayout
│   ├── search/     HeroSearch, AutocompleteDropdown
│   ├── destination/ WeatherCard, AttractionCard, Map, etc.
│   ├── trips/      SaveTripButton, TripCard, WishlistGrid
│   ├── itinerary/  DayColumn, ItineraryBuilder, AddItemModal
│   ├── reviews/    ReviewForm, ReviewCard, StarRating
│   └── ui/         Button, Card, Modal, Skeleton, Badge, Avatar
└── pages/
    ├── HomePage        /
    ├── ExplorePage     /explore/:city
    ├── DashboardPage   /dashboard  [protected]
    ├── ItineraryPage   /itinerary/:tripId  [protected]
    ├── ReviewsPage     /reviews/:city
    ├── SignInPage      /signin
    ├── SignUpPage      /signup
    └── ProfilePage     /profile  [protected]
```

---

## 🌐 Deployment

Deploy to **Vercel** (recommended):

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Vercel project settings
4. Deploy

---

*Built with passion for travel and clean code.*
