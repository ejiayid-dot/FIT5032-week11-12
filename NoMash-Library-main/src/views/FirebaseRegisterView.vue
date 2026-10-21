<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()

const register = async () => {
  if (isSubmitting.value) return

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const auth = getAuth()
    await createUserWithEmailAndPassword(auth, email.value.trim(), password.value)
    console.log('Firebase Register Successful!')
    await router.push('/FireLogin')
  } catch (error) {
    console.error(error.code)
    const messages = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Please choose a stronger password with at least 6 characters.',
      'auth/network-request-failed': 'Unable to connect. Check your connection and try again.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/operation-not-allowed': 'Email/password registration is currently unavailable.'
    }
    errorMessage.value = messages[error.code] || 'Registration failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="card register-card mx-auto shadow-sm">
      <div class="card-body p-4">
        <h1 class="h3 text-center mb-4">Create an Account</h1>
        <form @submit.prevent="register" :aria-busy="isSubmitting">
          <div class="mb-3">
            <label for="register-email" class="form-label">Email</label>
            <input
              id="register-email"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Email"
              autocomplete="email"
              :disabled="isSubmitting"
              required
            />
          </div>
          <div class="mb-3">
            <label for="register-password" class="form-label">Password</label>
            <input
              id="register-password"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Password"
              autocomplete="new-password"
              minlength="6"
              :disabled="isSubmitting"
              required
            />
          </div>
          <p v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>
          <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating account...' : 'Save to Firebase' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-card {
  max-width: 460px;
}
</style>
