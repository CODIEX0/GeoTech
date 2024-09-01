import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Select from 'react-select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './App.css';
import Header from './header';
import Footer from './footer';

const locations = [
  { value: [-33.9249, 18.4241], label: 'Cape Town' },
  { value: [-33.5821, 19.4475], label: 'Worcester' },
  { value: [-34.0469, 24.6906], label: 'Oudtshoorn' },
  { value: [-34.0833, 18.8667], label: 'Stellenbosch' },
  // { value: [-34.0375, 18.4157], label: 'Paarl' },
  // { value: [-34.2528, 18.7964], label: 'Hermanus' },
  // { value: [-34.0524, 18.4794], label: 'Somerset West' },
  // { value: [-33.9173, 18.8658], label: 'George' },
  // { value: [-33.9601, 18.5172], label: 'Knysna' },
];


function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [report, setReport] = useState('');
  const selectRef = useRef(null);

  function generateReport()
{
  const pdfFiles = ['data/capetown.pdf', 'data/worcester.pdf', 'data/oudtshoorn.pdf', 'data/stellenbosch.pdf'];

  // Loop through each file and download it
  pdfFiles.forEach(file => {
    const link = document.createElement('a');
    link.href = file;
    link.download = file;
    link.click();
  });

}
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude,
          longitude,
          hourly: ['temperature_2m', 'precipitation', 'soil_temperature_0cm', 'soil_moisture_0_to_10cm'],
          timezone: 'auto'
        }
      });
      setWeatherData(response.data);
      // generateReportWithGemini(); 
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleLocationSelect = (selectedOption) => {
    if (selectedOption) {
      const [lat, lon] = selectedOption.value;
      setLocation([parseFloat(lat), parseFloat(lon)]);
      fetchWeatherData(lat, lon);
    } else {
      setLocation(null);
    }
  };

  const prepareGraphData = () => {
    if (!weatherData) return [];
    const hours = weatherData.hourly.time;
    
    const temperatures = weatherData.hourly.temperature_2m;
    const precipitations = weatherData.hourly.precipitation;
    const soilTemperatures = weatherData.hourly.soil_temperature_0cm;
    const soilMoistures = weatherData.hourly.soil_moisture_0_to_10cm;

    console.log("hours: ", hours);
    console.log("temparatures: ", temperatures);
    console.log("precipatitions: ", precipitations);
    console.log("soil temparatures: ", soilTemperatures);
    console.log("soil moistures: ", soilMoistures);




    return hours.map((hour, index) => ({
      hour: hour,
      temperature: temperatures[index],
      precipitation: precipitations[index],
      soilTemperature: soilTemperatures[index],
      soilMoisture: soilMoistures[index],
    }));
  };

  // const generateReportWithGemini = async () => {
  //   if (!weatherData) return;
  
  //   const prompt = `
  //     Based on the following weather data:
  //     - Temperature: ${weatherData.hourly.temperature_2m.join(', ')}
  //     - Precipitation: ${weatherData.hourly.precipitation.join(', ')}
  //     - Soil Temperature: ${weatherData.hourly.soil_temperature_0cm.join(', ')}
  //     - Soil Moisture: ${weatherData.hourly.soil_moisture_0_to_10cm.join(', ')}
      
  //     Generate a summary report.
  //   `;
  
  //   try {
  //     const response = await axios.post('https://api.ai.meta.com/v1/generate', {
  //       prompt: prompt,
  //       maxTokens: 2048,
  //       temperature: 0.5,
  //     }, {
  //       headers: {
  //         'Authorization': `Bearer ${'d600de8b51e542f4adc3e4e189f08283'}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  
  //     setReport(response.data.choices[0].text);
  //   } catch (error) {
  //     console.error('Error generating report with Gemini:', error.response ? error.response.data : error.message);
  //   }
  // };

  const graphData = prepareGraphData();














// Example usage
// locations.forEach(location => {
//   const [latitude, longitude] = location.value;
//   fetchWeatherData(latitude, longitude).then(weatherData => {
//     generateAndSaveReport(location.label, weatherData);
//   });
// });

  return (
    <div className="app">
      <Header />
      <div className="app-header">
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
          <div className="carousel-container">
            <Carousel showArrows={true} infiniteLoop={true} showThumbs={false}>
              {/* Temperature Chart */}
              <div className="chart-container">
                <h3>Temperature</h3>
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
                </LineChart>
              </div>
              {/* Precipitation Chart */}
              <div className="chart-container">
                <h3>Precipitation</h3>
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
                  <Line type="monotone" dataKey="precipitation" stroke="#82ca9d" />
                </LineChart>
              </div>
              {/* Soil Temperature & Moisture Chart */}
              <div className="chart-container">
                <h3>Soil Temperature & Moisture</h3>
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
                  <Line type="monotone" dataKey="soilTemperature" stroke="#ff7300" />
                  <Line type="monotone" dataKey="soilMoisture" stroke="#ff0000" />
                </LineChart>
              </div>
            </Carousel>
          </div>
          <button onClick={generateReport()}>Generate Report</button>
          </main>
      )}
      <Footer />
    </div>
  );
}

export default App;
