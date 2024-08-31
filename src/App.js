import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await axios.get('https://your-dea-api-endpoint/geojson');
        setGeoData(response.data);
      } catch (error) {
        console.error('Error fetching geospatial data:', error);
      }
    };

    fetchGeoData();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>GeoTech Climate Resilience</h1>
      </header>
      <main>
        <div className="map-container">
          <MapContainer center={[-1.286389, 36.817223]} zoom={6} className="map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {geoData && <GeoJSON data={geoData} />}
          </MapContainer>
        </div>
      </main>
      <footer className="app-footer">
        <p>Powered by Digital Earth Africa | GeoTech Solutions</p>
      </footer>
    </div>
  );
}

export default App;
