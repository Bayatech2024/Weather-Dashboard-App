import React, { useState, useEffect } from 'react';

const API_KEY = '8625d67fcce15cf5094899b8b9806878';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const DEFAULT_CITY = 'Addis Ababa';

const getBackgroundClass = (weatherCondition) => {
  const condition = weatherCondition.toLowerCase();
  if (condition.includes('clear')) return 'from-blue-400 to-blue-700';
  if (condition.includes('cloud')) return 'from-gray-300 to-gray-600';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'from-blue-600 to-gray-800';
  if (condition.includes('thunderstorm')) return 'from-gray-700 to-gray-900';
  if (condition.includes('snow')) return 'from-blue-100 to-blue-300';
  if (condition.includes('mist') || condition.includes('fog')) return 'from-gray-400 to-gray-600';
  return 'from-blue-400 to-blue-700'; // default background
};

const WeatherSymbols = {
  temperature: '🌡️',
  humidity: '💧',
  wind: '💨',
  pressure: '🔽',
  search: '🔍',
};

const WeatherDashboard = () => {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backgroundClass, setBackgroundClass] = useState('from-blue-400 to-blue-700');

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'City not found. Please check the spelling and try again.' : 'An error occurred while fetching weather data.');
      }
      const data = await response.json();
      setWeatherData(data);
      setBackgroundClass(getBackgroundClass(data.weather[0].main));
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(DEFAULT_CITY);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Weather Dashboard</h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">{WeatherSymbols.search}</span>
          </div>
          <button
            type="submit"
            className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out flex items-center justify-center"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {weatherData && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">{weatherData.name}, {weatherData.sys.country}</h2>
            <div className="flex justify-center items-center mb-4">
              <img
                src={getWeatherIcon(weatherData.weather[0].icon)}
                alt={weatherData.weather[0].description}
                className="w-16 h-16"
              />
              <p className="text-5xl font-bold ml-4">{Math.round(weatherData.main.temp)}°C</p>
            </div>
            <p className="text-xl mb-4 capitalize">{weatherData.weather[0].description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-50 p-3 rounded-lg flex items-center">
                <span className="text-2xl mr-2">{WeatherSymbols.temperature}</span>
                <div>
                  <p className="text-sm text-gray-600">Feels Like</p>
                  <p className="font-semibold">{Math.round(weatherData.main.feels_like)}°C</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-50 p-3 rounded-lg flex items-center">
                <span className="text-2xl mr-2">{WeatherSymbols.humidity}</span>
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="font-semibold">{weatherData.main.humidity}%</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-50 p-3 rounded-lg flex items-center">
                <span className="text-2xl mr-2">{WeatherSymbols.wind}</span>
                <div>
                  <p className="text-sm text-gray-600">Wind Speed</p>
                  <p className="font-semibold">{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-50 p-3 rounded-lg flex items-center">
                <span className="text-2xl mr-2">{WeatherSymbols.pressure}</span>
                <div>
                  <p className="text-sm text-gray-600">Pressure</p>
                  <p className="font-semibold">{weatherData.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
