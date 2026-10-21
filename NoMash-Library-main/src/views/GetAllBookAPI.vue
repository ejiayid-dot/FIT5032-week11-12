<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const error = ref('')
const loading = ref(true)
const functionUrl = 'https://us-central1-fit5032-c74ff.cloudfunctions.net/getAllBooks'

const getAllBookAPI = async () => {
  try {
    const response = await axios.get(functionUrl, { timeout: 60000 })
    jsondata.value = response.data
  } catch {
    error.value = 'Unable to get books. Please reload to try again.'
  } finally {
    loading.value = false
  }
}

onMounted(getAllBookAPI)
</script>

<template>
  <p v-if="loading" role="status">Loading books...</p>
  <p v-else-if="error" class="text-danger" role="alert">{{ error }}</p>
  <pre v-else>{{ JSON.stringify(jsondata, null, 2) }}</pre>
</template>
