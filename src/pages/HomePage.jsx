import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import HeroSearch from '@/components/search/HeroSearch'
import styles from './HomePage.module.css'

const FEATURED = [
  { city: 'Paris',          country: 'France',        emoji: '🗼', tagline: 'The City of Love',    color: '#fce7f3' },
  { city: 'Tokyo',          country: 'Japan',          emoji: '🌸', tagline: 'Where old meets new', color: '#ede9fe' },
  { city: 'New York City',  country: 'United States',  emoji: '🗽', tagline: 'The city that never sleeps', color: '#dbeafe' },
  { city: 'Bali',           country: 'Indonesia',      emoji: '🌴', tagline: 'Island of the Gods',  color: '#dcfce7' },
  { city: 'Rome',           country: 'Italy',          emoji: '🏛️', tagline: 'The Eternal City',    color: '#ffedd5' },
  { city: 'Sydney',         country: 'Australia',      emoji: '🦘', tagline: 'Harbour City',        color: '#ccfbf1' },
]

const STEPS = [
  { icon: '🔍', title: 'Search Any City',  desc: 'Type a destination and instantly get weather, photos, attractions, and more.' },
  { icon: '❤️', title: 'Save & Plan',       desc: 'Save your dream destinations and build day-by-day itineraries for your trips.' },
  { icon: '⭐', title: 'Read & Share',      desc: 'See real reviews from travelers and share your own experiences.' },
]

const FEATURES = [
  { icon: '🌤️', title: 'Live Weather',         desc: 'Real-time weather with a 3-day forecast and °F/°C toggle.' },
  { icon: '🗺️', title: 'Interactive Map',       desc: 'Explore cities and nearby attractions on a live map.' },
  { icon: '📸', title: 'City Photos',            desc: 'Beautiful destination photos pulled from Wikipedia.' },
  { icon: '🏛️', title: 'Nearby Attractions',     desc: 'Discover museums, galleries, viewpoints, and more.' },
  { icon: '🗓️', title: 'Trip Planner',           desc: 'Build a day-by-day itinerary and keep your plans organized.' },
  { icon: '🔒', title: 'Personal Account',       desc: 'Save destinations and access your trips from anywhere.' },
]

export default function HomePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>✈️ Your Ultimate Travel Companion</div>
          <h1 className={styles.heroTitle}>
            Explore the World,<br />
            <span className={styles.heroAccent}>Plan Your Adventure</span>
          </h1>
          <p className={styles.heroSub}>
            Search any city. Get live weather, photos, attractions, and real traveler reviews — all in one place.
          </p>
          <HeroSearch />
          <div className={styles.heroMeta}>
            <span>🌍 200+ countries covered</span>
            <span>·</span>
            <span>🌤️ Live weather data</span>
            <span>·</span>
            <span>⭐ Real reviews</span>
          </div>
        </div>
        <div className={styles.heroDecor}>
          <div className={styles.decor1} />
          <div className={styles.decor2} />
        </div>
      </section>

      {/* Featured Destinations */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Popular Destinations</h2>
            <p className={styles.sectionSub}>Explore some of the world's most beloved cities</p>
          </div>
          <div className={styles.featuredGrid}>
            {FEATURED.map(dest => (
              <Link
                key={dest.city}
                to={`/explore/${encodeURIComponent(dest.city)}`}
                className={styles.featuredCard}
                style={{ '--card-color': dest.color }}
              >
                <span className={styles.featuredEmoji}>{dest.emoji}</span>
                <div className={styles.featuredInfo}>
                  <span className={styles.featuredCity}>{dest.city}</span>
                  <span className={styles.featuredCountry}>{dest.country}</span>
                  <span className={styles.featuredTagline}>{dest.tagline}</span>
                </div>
                <span className={styles.featuredArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSub}>Three simple steps to your dream trip</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Everything You Need</h2>
            <p className={styles.sectionSub}>Powerful features to plan the perfect trip</p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h4 className={styles.featureTitle}>{f.title}</h4>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to start your next adventure?</h2>
          <p className={styles.ctaSub}>Create a free account and start planning your dream trips today.</p>
          <div className={styles.ctaButtons}>
            <Link to="/signup" className={styles.ctaPrimary}>Get Started — It's Free</Link>
            <Link to="/explore/Paris" className={styles.ctaSecondary}>Explore Paris →</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
