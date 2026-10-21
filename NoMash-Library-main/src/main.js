// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import db from './Firebase/init.js'
import { startFirebaseAuth, skipFirebaseAuth } from './firebaseAuth'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
// import DataTable from 'primevue/datatable'
// import Column from 'primevue/Column'

if (db) {
  startFirebaseAuth()
} else {
  skipFirebaseAuth()
  console.warn(
    'Firebase is not configured. Fill in .env.local using .env.example and restart Vite.'
  )
}

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

// app.component('DataTable', DataTable)
// app.component('Column', Column)

app.mount('#app')
