<script setup>
import { ref, computed, onMounted } from 'vue'
import { hasWeatherKey, getWeather, getCityWeather, getCurrentLocation, weatherError } from '../services/weather'

const city = ref('Clayton, AU')
const weatherData = ref(null)
const loading = ref(false)
const error = ref('')
const source = ref('')
const temperature = computed(() => weatherData.value?.main.temp.toFixed(1))
const iconUrl = computed(() => weatherData.value
  ? `https://openweathermap.org/img/wn/${weatherData.value.weather[0].icon}@2x.png` : '')

const loadWeather = async (fetchData, label) => {
  if (loading.value) return
  error.value = ''
  weatherData.value = null
  if (!hasWeatherKey) {
    error.value = 'Weather is not configured yet. Please contact the site owner.'
    return
  }
  loading.value = true
  try {
    weatherData.value = await fetchData()
    source.value = label
  } catch (err) {
    error.value = weatherError(err)
  } finally {
    loading.value = false
  }
}

const searchByCity = () => {
  if (!city.value.trim()) { error.value = 'Please enter a city.'; return }
  return loadWeather(() => getCityWeather(city.value), 'City search')
}
const fetchCurrentLocationWeather = () => loadWeather(async () => {
  const { latitude, longitude } = await getCurrentLocation()
  return getWeather(latitude, longitude)
}, 'Current location')

onMounted(searchByCity)
</script>

<template>
  <section class="weather-page">
    <h1>Weather Check</h1>
    <form class="d-flex gap-2 my-3" @submit.prevent="searchByCity">
      <label class="visually-hidden" for="weather-city">City and country</label>
      <input id="weather-city" v-model="city" class="form-control" placeholder="Clayton, AU" :disabled="loading" />
      <button class="btn btn-primary" :disabled="loading">Search</button>
    </form>
    <button class="btn btn-outline-primary" :disabled="loading" @click="fetchCurrentLocationWeather">Use current location</button>
    <p v-if="loading" class="mt-3" role="status">Loading weather...</p>
    <p v-if="error" class="text-danger mt-3" role="alert">{{ error }}</p>
    <article v-if="weatherData" class="card p-4 mt-4" aria-live="polite">
      <p class="text-secondary mb-1">{{ source }}</p>
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <div class="d-flex align-items-center gap-3">
        <img :src="iconUrl" :alt="weatherData.weather[0].description" width="100" height="100" />
        <p class="fs-2 mb-0">{{ temperature }} °C</p>
      </div>
      <p class="mb-0 text-capitalize">{{ weatherData.weather[0].description }}</p>
    </article>
    <p class="text-secondary mt-3">Weather data from OpenWeather</p>
  </section>
</template>

<style scoped>
.weather-page { max-width: 560px; margin: 20px auto; }
</style>
