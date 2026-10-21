<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const error = ref('')
const loading = ref(false)
const functionUrl = 'https://us-central1-fit5032-c74ff.cloudfunctions.net/countBooks'

const getBookCount = async () => {
  loading.value = true
  count.value = null
  error.value = ''

  try {
    const response = await axios.get(functionUrl)
    count.value = response.data.count
  } catch (err) {
    console.error('Error fetching book count:', err)
    error.value = 'Unable to get the book count. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section>
    <h1>Book Counter</h1>
    <button type="button" class="btn btn-primary" :disabled="loading" @click="getBookCount">
      {{ loading ? 'Loading...' : 'Get Book Count' }}
    </button>
    <div class="mt-3" aria-live="polite" :aria-busy="loading">
      <p v-if="count !== null">Total number of books: {{ count }}</p>
      <p v-else-if="error" class="text-danger" role="alert">Error: {{ error }}</p>
    </div>
  </section>
</template>
