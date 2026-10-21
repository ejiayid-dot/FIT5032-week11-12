<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../auth'

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const route = useRoute()
const router = useRouter()

const wasRedirected = computed(() => route.query.reason === 'auth-required')

const handleLogin = async () => {
  errorMessage.value = ''

  if (!login(username.value, password.value)) {
    errorMessage.value = 'Invalid username or password.'
    return
  }

  const requestedPath = route.query.redirect
  const redirectPath =
    typeof requestedPath === 'string' && requestedPath.startsWith('/')
      ? requestedPath
      : '/about'

  await router.push(redirectPath)
}
</script>

<template>
  <div class="login-view container mt-5">
    <div v-if="wasRedirected" class="alert alert-danger" role="alert">
      <h2 class="h5 alert-heading">Access denied</h2>
      <p class="mb-0">Please log in before opening the members-only About page.</p>
    </div>

    <div class="card login-card mx-auto shadow-sm">
      <div class="card-body p-4">
        <h1 class="h3 text-center mb-3">Library Member Login</h1>
        <p class="text-muted text-center">Sign in to access the secure members area.</p>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="login-username" class="form-label">Username</label>
            <input
              id="login-username"
              v-model="username"
              type="text"
              class="form-control"
              autocomplete="username"
              required
            />
          </div>

          <div class="mb-3">
            <label for="login-password" class="form-label">Password</label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              class="form-control"
              autocomplete="current-password"
              required
            />
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2" role="alert">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary w-100">Log in</button>
        </form>

        <p class="small text-muted text-center mt-3 mb-0">
          Demo credentials: <strong>member</strong> / <strong>library123</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  max-width: 460px;
}
</style>
