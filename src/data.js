import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Select from 'react-select';

// Define locations with latitude and longitude values
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
function Data()
{
    const [weatherData, setWeatherData] = useState(null);
    const [chatbotResponse, setChatbotResponse] = useState('');
    const [location, setLocation] = useState(null);
    const selectRef = useRef(null);

    const fetchWeatherData = async (latitude, longitude) => {
        try {
          const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
              latitude,
              longitude,
              hourly: ['temperature_2m', 'precipitation', 'soil_temperature_0cm', 'soil_moisture_0_to_10cm'],
              timezone: 'auto'
            }
          });
          setWeatherData(response.data);
        
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };
    
    
    
      const handleLocationSelect = (selectedOption) => {
        if (selectedOption) {
          const [lat, lon] = selectedOption.value;
          setLocation([parseFloat(lat), parseFloat(lon)]);
          fetchWeatherData(lat, lon); // Fetch weather data for the selected location
        } else {
          setLocation(null);
        }
      };

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

// eslint-disable-next-line no-lone-blocks
{location && weatherData && (
    <main>
      <div className="map-container" style={{ height: '400px' }}>
        <MapContainer center={location} zoom={8} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={location}>
            <Popup>
              <h3>Weather Data</h3>
              <p>Temperature: {weatherData.hourly.temperature_2m[0]} °C</p>
              <p>Precipitation: {weatherData.hourly.precipitation[0]} mm</p>
              <p>Soil Temperature: {weatherData.hourly.soil_temperature_0cm[0]} °C</p>
              <p>Soil Moisture: {weatherData.hourly.soil_moisture_0_to_10cm[0]}</p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="data-container">
        <h2>Chatbot Advice</h2>
        <p>{chatbotResponse}</p>
      </div>
    </main>
    )}

}

export default Data;
