import { useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import dwaparaData from '@/dwapara-yuga.json'

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
})

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<any>(null)

  return (
    <>
      <Head>
        <title>Dwapara Yuga - Interactive Map</title>
        <meta name="description" content="Interactive map of Dwapara Yuga kingdoms, places, and sacred sites" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <header className="header">
          <h1>🏛️ Dwapara Yuga - Interactive Historical Map</h1>
          <p className="subtitle">{dwaparaData.description}</p>
        </header>

        <div className="controls">
          <div className="filter-section">
            <label htmlFor="category">Filter by Category:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select"
            >
              <option value="all">All Locations</option>
              <option value="kingdoms">Major Kingdoms</option>
              <option value="sacred">Sacred Places</option>
              <option value="ashrams">Ashrams</option>
              <option value="forests">Forests</option>
            </select>
          </div>

          <div className="info-box">
            <h3>Timeline</h3>
            <p><strong>Traditional:</strong> {dwaparaData.timeframe.traditional}</p>
            <p><strong>Historical:</strong> {dwaparaData.timeframe.historical_correlation}</p>
          </div>
        </div>

        <div className="map-container">
          <MapComponent
            data={dwaparaData}
            category={selectedCategory}
            onSelectItem={setSelectedItem}
          />
        </div>

        {selectedItem && (
          <div className="detail-panel">
            <button className="close-btn" onClick={() => setSelectedItem(null)}>✕</button>
            <h2>{selectedItem.name}</h2>

            {selectedItem.modern_location && (
              <div className="detail-section">
                <h3>📍 Modern Location</h3>
                <p><strong>Country:</strong> {selectedItem.modern_location.country}</p>
                {selectedItem.modern_location.state && (
                  <p><strong>State/Region:</strong> {selectedItem.modern_location.state || selectedItem.modern_location.region}</p>
                )}
                {selectedItem.modern_location.nearest_city && (
                  <p><strong>Nearest City:</strong> {selectedItem.modern_location.nearest_city}</p>
                )}
                {selectedItem.modern_location.coordinates && (
                  <p><strong>Coordinates:</strong> {selectedItem.modern_location.coordinates.latitude.toFixed(4)}°N, {selectedItem.modern_location.coordinates.longitude.toFixed(4)}°E</p>
                )}
              </div>
            )}

            {selectedItem.rulers && (
              <div className="detail-section">
                <h3>👑 Rulers</h3>
                <p>{selectedItem.rulers.join(', ')}</p>
              </div>
            )}

            {selectedItem.description && (
              <div className="detail-section">
                <h3>📜 Description</h3>
                <p>{selectedItem.description}</p>
              </div>
            )}

            {selectedItem.significance && (
              <div className="detail-section">
                <h3>⭐ Significance</h3>
                <p>{selectedItem.significance}</p>
              </div>
            )}

            {selectedItem.modern_location?.archaeological_note && (
              <div className="detail-section archaeological">
                <h3>🔍 Archaeological Note</h3>
                <p>{selectedItem.modern_location.archaeological_note}</p>
              </div>
            )}
          </div>
        )}

        <div className="data-section">
          <div className="data-grid">
            <div className="data-card">
              <h3>🏰 Major Kingdoms</h3>
              <div className="list">
                {dwaparaData.major_kingdoms.slice(0, 10).map((kingdom, idx) => (
                  <div key={idx} className="list-item" onClick={() => setSelectedItem(kingdom)}>
                    <strong>{kingdom.name}</strong>
                    <span>{kingdom.modern_location.country}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h3>🕉️ Sacred Places</h3>
              <div className="list">
                {dwaparaData.sacred_places.map((place, idx) => (
                  <div key={idx} className="list-item" onClick={() => setSelectedItem(place)}>
                    <strong>{place.name}</strong>
                    <span>{place.modern_location.nearest_city}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h3>🏔️ Key Rivers</h3>
              <div className="list">
                {dwaparaData.rivers.slice(0, 8).map((river, idx) => (
                  <div key={idx} className="list-item">
                    <strong>{river.name}</strong>
                    <span>{river.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h3>👤 Key Personalities</h3>
              <div className="list">
                {dwaparaData.key_personalities.map((person, idx) => (
                  <div key={idx} className="list-item">
                    <strong>{person.name}</strong>
                    <span>{person.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="archaeological-section">
          <h2>🔬 Archaeological Evidence</h2>
          <div className="archaeological-grid">
            {dwaparaData.archaeological_evidence.map((evidence, idx) => (
              <div key={idx} className="archaeological-card">
                <h3>{evidence.site}</h3>
                <p><strong>Location:</strong> {evidence.location}</p>
                <p><strong>Findings:</strong> {evidence.findings}</p>
                <p><strong>Excavator:</strong> {evidence.excavator}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="footer">
          <p>Data compiled from Mahabharata, Puranas, and archaeological sources</p>
          <p>Traditional dates and modern correlations provided for historical context</p>
        </footer>
      </main>
    </>
  )
}
