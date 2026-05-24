# Jetset

Jetset is a travel discovery and trip-planning app built as a portfolio project. The goal was to make something that feels useful quickly: search a city, see weather and travel context, browse nearby attractions, save destinations, plan an itinerary, and leave reviews.

The app currently uses a lightweight localStorage-backed data layer for auth-style demo flows, saved trips, itineraries, and reviews. That keeps the live demo easy to use without requiring a real account or backend setup.

Live demo: https://briannab1997.github.io/BBtravel-explorer/

## What It Does

- Search for cities with autocomplete
- View travel context, weather, photos, and nearby attractions
- Explore attractions on an interactive map
- Save destinations to a wishlist
- Build simple day-by-day itineraries
- Add and view destination reviews
- Use demo sign-in/sign-up flows backed by localStorage
- Toggle light/dark mode
- Use the app across desktop and mobile layouts

## Why I Built It

Jetset gave me room to practice API-heavy front-end work: multiple data sources, loading states, protected routes, reusable components, and user flows that cross several screens. It is also a good example of turning an open-ended idea into a structured product experience.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router |
| State/Data | React Query, localStorage mock backend |
| Maps | Leaflet.js + react-leaflet |
| APIs | Open-Meteo, Wikipedia, OpenStreetMap/Nominatim, Overpass |
| Styling | CSS Modules + CSS Custom Properties |
| Deployment | GitHub Pages + GitHub Actions |

## Run Locally

```bash
git clone https://github.com/briannab1997/BBtravel-explorer.git
cd BBtravel-explorer
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

No environment variables are required for the current portfolio demo.

## Build

```bash
npm run build
```

## Project Structure

```text
src/
├── components/      Reusable UI, map, search, itinerary, and review pieces
├── context/         Auth-style demo session state
├── hooks/           Trips, reviews, itinerary, autocomplete, auth helpers
├── lib/             localStorage mock data layer
├── pages/           Home, explore, dashboard, itinerary, reviews, auth, profile
├── services/        External API and demo data services
└── styles/          Global design tokens and base styles
```

## Portfolio Summary

Jetset demonstrates React routing, API integration, async data handling, reusable UI patterns, mock authentication, saved user data, itinerary workflows, reviews, maps, and responsive design.
