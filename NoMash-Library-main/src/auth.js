import { computed, ref } from 'vue'
import { firebaseUser } from './firebaseAuth'

const AUTH_STORAGE_KEY = 'library-is-authenticated'
const VALID_USERNAME = 'member'
const VALID_PASSWORD = 'library123'

const hasStoredSession =
  typeof window !== 'undefined' && window.sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'

const demoAuthenticated = ref(hasStoredSession)
export const isAuthenticated = computed(() => demoAuthenticated.value || !!firebaseUser.value)

export const login = (username, password) => {
  const credentialsAreValid = username.trim() === VALID_USERNAME && password === VALID_PASSWORD

  demoAuthenticated.value = credentialsAreValid

  if (typeof window !== 'undefined') {
    if (credentialsAreValid) {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
    } else {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  return credentialsAreValid
}

export const logout = () => {
  demoAuthenticated.value = false

  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
  }
}
