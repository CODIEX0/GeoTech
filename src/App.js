import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Select from 'react-select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; // Import Recharts components
import './App.css';
import Header from './header';
import Footer from './footer';
import Data from './data';


function App() {
  const [weatherData, setWeatherData] = useState(null);
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

  // Prepare data for the graphs
  const prepareGraphData = () => {
    if (!weatherData) return [];
    const hours = weatherData.hourly.time; // Assuming this is an array of time strings
    const temperatures = weatherData.hourly.temperature_2m; // Assuming this is an array of temperatures
    const precipitations = weatherData.hourly.precipitation; // Assuming this is an array of precipitation
    const soilTemperatures = weatherData.hourly.soil_temperature_0cm; // Soil temperatures
    const soilMoistures = weatherData.hourly.soil_moisture_0_to_10cm; // Soil moisture

    return hours.map((hour, index) => ({
      hour: hour, // Time
      temperature: temperatures[index], // Temperature
      precipitation: precipitations[index], // Precipitation
      soilTemperature: soilTemperatures[index], // Soil Temperature
      soilMoisture: soilMoistures[index], // Soil Moisture
    }));
  };

  const graphData = prepareGraphData();

  return (
    <div className="app">
      <Header />
      <Data/>
      <div className="app-header">
        
      </div>
      {location && weatherData && (
        <main>
          <div className="map-container">
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
            <h2>Weather Data Over Time</h2>
            <LineChart
              width={600}
              height={300}
              data={graphData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              <Line type="monotone" dataKey="precipitation" stroke="#82ca9d" />
              <Line type="monotone" dataKey="soilTemperature" stroke="#ff7300" />
              <Line type="monotone" dataKey="soilMoisture" stroke="#ff0000" />
            </LineChart>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}

export default App;