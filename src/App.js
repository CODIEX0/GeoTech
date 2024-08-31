import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Select from 'react-select';
import './App.css';

const locations = [
  { value: [-26.2041, 28.0473], label: 'Gauteng' },
  { value: [-33.9249, 18.4241], label: 'Western Cape' },
  { value: [-29.8587, 31.0218], label: 'KwaZulu-Natal' },
  { value: [-25.7479, 28.2293], label: 'Limpopo' },
  { value: [-28.4793, 24.6727], label: 'Northern Cape' },
  { value: [-31.2532, 26.5225], label: 'Eastern Cape' },
  { value: [-29.6006, 30.3794], label: 'Free State' },
  { value: [-23.9045, 29.4689], label: 'Mpumalanga' },
  { value: [-27.4698, 29.9324], label: 'North West' }
];

function App() {
  const [precipitationImage, setPrecipitationImage] = useState('');
  const [soilImage, setSoilImage] = useState('');
  const [temperatureImage, setTemperatureImage] = useState('');
  const [location, setLocation] = useState(null);
  const selectRef = useRef(null);

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/${endpoint}`);
      setter(response.data.image);
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
    }
  };

  const handleLocationSelect = (selectedOption) => {
    if (selectedOption) {
      const [lat, lon] = selectedOption.value;
      setLocation([parseFloat(lat), parseFloat(lon)]);
    } else {
      setLocation(null);
    }
  };

  useEffect(() => {
    if (location) {
      fetchData('precipitation', setPrecipitationImage);
      fetchData('soil', setSoilImage);
      fetchData('temperature', setTemperatureImage);
    }
  }, [location]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>GeoTech Climate Resilience</h1>
        <div className="select-container">
          <Select
            ref={selectRef}
            placeholder="Select a location..."
            options={locations}
            onChange={handleLocationSelect}
            isClearable
            menuPortalTarget={document.body}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: 'black',
                fontWeight: 'bold',
                zIndex: 1000,
                position: 'absolute',
                top: '10px',
                left: '10px'
              }),
              singleValue: (base) => ({
                ...base,
                color: 'black'
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999
              })
            }}
          />
        </div>
      </header>
      {location && (
        <main>
          <div className="map-container">
            <MapContainer center={location} zoom={8} className="map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
            </MapContainer>
          </div>
          <div className="data-container">
            <h2>Precipitation Data</h2>
            <img src={`data:image/png;base64,${precipitationImage}`} alt="Precipitation Plot" />

            <h2>Soil Moisture Data</h2>
            <img src={`data:image/png;base64,${soilImage}`} alt="Soil Moisture Plot" />

            <h2>Temperature Data</h2>
            <img src={`data:image/png;base64,${temperatureImage}`} alt="Temperature Plot" />
          </div>
        </main>
      )}
      <footer className="app-footer">
        <p>Powered by OpenStreetMap | GeoTech Solutions</p>
      </footer>
    </div>
  );
}

export default App;











