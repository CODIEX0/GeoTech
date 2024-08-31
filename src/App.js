import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
import './App.css';
import Header from './header';
import Footer from './footer';
import Search from './search';
function App() {
  const [geoData, setGeoData] = useState(null);

  // useEffect(() => {
  //   const fetchGeoData = async () => {
  //     try {
  //       const response = await axios.get('https://your-dea-api-endpoint/geojson');
  //       setGeoData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching geospatial data:', error);
  //     }
  //   };

  //   fetchGeoData();
  // }, []);

  return (
    <div className="app">
      <Header/>
      <Search/>
       <Footer/>
      
    </div>
  );
}

export default App;
