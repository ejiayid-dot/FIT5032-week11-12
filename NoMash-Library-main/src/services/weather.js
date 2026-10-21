import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim()
const baseUrl = 'https://api.openweathermap.org'
const proxyBase = import.meta.env.VITE_WEATHER_API_BASE?.replace(/\/$/, '') ||
  (import.meta.env.PROD ? window.location.origin : '')

export const hasWeatherKey = Boolean(apiKey || proxyBase)

export const getWeather = async (latitude, longitude) => {
  if (!apiKey && proxyBase) {
    const { data } = await axios.get(`${proxyBase}/api/weather`, {
      params: { lat: latitude, lon: longitude }, timeout: 15000
    })
    return data
  }
  const { data } = await axios.get(`${baseUrl}/data/2.5/weather`, {
    params: { lat: latitude, lon: longitude, appid: apiKey, units: 'metric' },
    timeout: 15000
  })
  return data
}

export const getCityWeather = async (city) => {
  if (!apiKey && proxyBase) {
    const { data } = await axios.get(`${proxyBase}/api/weather`, {
      params: { city: city.trim() }, timeout: 15000
    })
    return data
  }
  const { data: locations } = await axios.get(`${baseUrl}/geo/1.0/direct`, {
    params: { q: city.trim(), appid: apiKey, limit: 1 },
    timeout: 15000
  })
  if (!locations.length) throw new Error('City not found. Try a city and country, such as Clayton, AU.')
  const location = locations[0]
  const weather = await getWeather(location.lat, location.lon)
  return { ...weather, name: location.name }
}

export const getCurrentLocation = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error('Your browser does not support location. Search by city instead.'))
    return
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve(coords),
    (error) => reject(new Error(error.code === 1
      ? 'Location permission was denied. Search by city or enable location and try again.'
      : 'Could not get your location. Search by city or try again.')),
    { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }
  )
})

export const weatherError = (error) => {
  if (error.response?.status === 401) return 'The OpenWeather API key is invalid or not active yet.'
  if (error.response?.status === 429) return 'The weather request limit has been reached. Try again later.'
  if (error.response?.status === 404) return 'Weather was not found for this location.'
  if (error.isAxiosError) return 'Could not reach the weather service. Please try again.'
  return error.message || 'Unable to load weather. Please try again.'
}
