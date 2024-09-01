// WeatherCarousel.js
import React, { useState } from 'react';
import { FaCloudRain, FaTemperatureHigh, FaSeedling } from 'react-icons/fa';

const WeatherCarousel = () => {
  const [selectedIcon, setSelectedIcon] = useState('soil');

  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
  };

  const getBackgroundImage = () => {
    switch (selectedIcon) {
      case 'soil':
        return "url('/images/soil.jpg')";
      case 'rain':
        return "url('/images/rain.jpg')";
      case 'temperature':
        return "url('/images/temperature.jpg')";
      default:
        return "url('/images/soil.jpg')";
    }
  };

  return (
    <div className="carousel-container" style={{ backgroundImage: getBackgroundImage() }}>
      <div className="carousel-icons">
        <FaSeedling
          className={`carousel-icon ${selectedIcon === 'soil' ? 'selected' : ''}`}
          onClick={() => handleIconClick('soil')}
          size={50}
        />
        <FaCloudRain
          className={`carousel-icon ${selectedIcon === 'rain' ? 'selected' : ''}`}
          onClick={() => handleIconClick('rain')}
          size={50}
        />
        <FaTemperatureHigh
          className={`carousel-icon ${selectedIcon === 'temperature' ? 'selected' : ''}`}
          onClick={() => handleIconClick('temperature')}
          size={50}
        />
      </div>
    </div>
  );
};

export default WeatherCarousel;
