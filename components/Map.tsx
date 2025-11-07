import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons
const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

const icons = {
  kingdom: createIcon('red'),
  sacred: createIcon('gold'),
  ashram: createIcon('green'),
  forest: createIcon('violet'),
}

interface MapProps {
  data: any
  category: string
  onSelectItem: (item: any) => void
}

export default function Map({ data, category, onSelectItem }: MapProps) {
  const [markers, setMarkers] = useState<any[]>([])

  useEffect(() => {
    const allMarkers: any[] = []

    if (category === 'all' || category === 'kingdoms') {
      data.major_kingdoms.forEach((kingdom: any) => {
        if (kingdom.modern_location?.coordinates) {
          allMarkers.push({
            position: [
              kingdom.modern_location.coordinates.latitude,
              kingdom.modern_location.coordinates.longitude,
            ],
            name: kingdom.name,
            type: 'kingdom',
            data: kingdom,
          })
        }
      })
    }

    if (category === 'all' || category === 'sacred') {
      data.sacred_places.forEach((place: any) => {
        if (place.modern_location?.coordinates) {
          allMarkers.push({
            position: [
              place.modern_location.coordinates.latitude,
              place.modern_location.coordinates.longitude,
            ],
            name: place.name,
            type: 'sacred',
            data: place,
          })
        }
      })
    }

    if (category === 'all' || category === 'ashrams') {
      data.ashrams_and_hermitages.forEach((ashram: any) => {
        if (ashram.modern_location?.coordinates) {
          allMarkers.push({
            position: [
              ashram.modern_location.coordinates.latitude,
              ashram.modern_location.coordinates.longitude,
            ],
            name: ashram.name,
            type: 'ashram',
            data: ashram,
          })
        }
      })
    }

    if (category === 'all' || category === 'forests') {
      data.forests_and_regions.forEach((forest: any) => {
        if (forest.modern_location?.coordinates) {
          allMarkers.push({
            position: [
              forest.modern_location.coordinates.latitude,
              forest.modern_location.coordinates.longitude,
            ],
            name: forest.name,
            type: 'forest',
            data: forest,
          })
        }
      })
    }

    setMarkers(allMarkers)
  }, [data, category])

  return (
    <MapContainer
      center={[25.0, 78.0]}
      zoom={5}
      style={{ height: '600px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((marker, idx) => (
        <Marker
          key={idx}
          position={marker.position as [number, number]}
          icon={icons[marker.type as keyof typeof icons] || icons.kingdom}
          eventHandlers={{
            click: () => onSelectItem(marker.data),
          }}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <strong style={{ fontSize: '16px' }}>{marker.name}</strong>
              <br />
              <span style={{ fontSize: '12px', color: '#666' }}>
                {marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}
              </span>
              {marker.data.description && (
                <>
                  <br />
                  <br />
                  <p style={{ fontSize: '13px', margin: 0 }}>
                    {marker.data.description}
                  </p>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
