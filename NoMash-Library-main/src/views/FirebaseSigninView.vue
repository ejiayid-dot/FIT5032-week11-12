<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { syncFirebaseUser, firebaseRole } from '../firebaseAuth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()

const signin = async () => {
  if (isSubmitting.value) return

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    console.log('Firebase Sign in Successful!')
    // Inspect the current user without logging session tokens.
    const user = auth.currentUser
    syncFirebaseUser(user)
    console.log('Current Firebase user:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      role: firebaseRole.value
    })
    await router.push('/account')
  } catch (error) {
    console.error(error.code)
    const messages = {
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/invalid-login-credentials': 'Incorrect email or password.',
      'auth/user-not-found': 'Incorrect email or password.',
      'auth/wrong-password': 'Incorrect email or password.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/network-request-failed': 'Unable to connect. Check your connection and try again.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/operation-not-allowed': 'Email/password sign-in is currently unavailable.'
    }
    errorMessage.value = messages[error.code] || 'Sign-in failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="card signin-card mx-auto shadow-sm">
      <div class="card-body p-4">
        <h1 class="h3 text-center mb-4">Sign in</h1>
        <form @submit.prevent="signin" :aria-busy="isSubmitting">
          <div class="mb-3">
            <label for="signin-email" class="form-label">Email</label>
            <input
              id="signin-email"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Email"
              autocomplete="username"
              :disabled="isSubmitting"
              required
            />
          </div>
          <div class="mb-3">
            <label for="signin-password" class="form-label">Password</label>
            <input
              id="signin-password"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Password"
              autocomplete="current-password"
              :disabled="isSubmitting"
              required
            />
          </div>
          <p v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>
          <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing in...' : 'Sign in via Firebase' }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0">
          <router-link to="/FireRegister">Create an account</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signin-card {
  max-width: 460px;
}
</style>
