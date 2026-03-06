import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import styles from './DestinationMap.module.css'

// Fix Leaflet default marker icons broken by Vite
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

function Recenter({ lat, lon }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lon], 12) }, [lat, lon, map])
  return null
}

export default function DestinationMap({ lat, lon, city, attractions = [] }) {
  if (!lat || !lon) return null

  return (
    <div className={styles.wrapper}>
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        className={styles.map}
        scrollWheelZoom={false}
      >
        <Recenter lat={lat} lon={lon} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <Marker position={[lat, lon]}>
          <Popup><strong>{city}</strong></Popup>
        </Marker>
        {attractions.filter(a => a.lat && a.lon).map((a, i) => (
          <Marker key={i} position={[a.lat, a.lon]}>
            <Popup>{a.emoji} {a.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
