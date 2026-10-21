<script setup>
import { ref } from 'vue'
import { firebaseUser, logoutFirebase } from '../firebaseAuth'
import { logout } from '../auth'

const isSubmitting = ref(false)
const errorMessage = ref('')
const hasLoggedOut = ref(false)

const signout = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await logoutFirebase()
    logout()
    hasLoggedOut.value = true
  } catch {
    errorMessage.value = 'Unable to log out. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="container mt-5">
    <div class="card mx-auto shadow-sm" style="max-width: 560px">
      <div class="card-body p-4">
        <h1 class="h3">Firebase Logout</h1>
        <template v-if="hasLoggedOut">
          <p class="alert alert-success" role="status">You have successfully logged out.</p>
          <p>
            Current Firebase user:
            <strong>{{ firebaseUser === null ? 'null' : firebaseUser.email }}</strong>
          </p>
          <router-link to="/FireLogin" class="btn btn-primary">Sign in again</router-link>
        </template>
        <template v-else>
          <p v-if="firebaseUser">Signed in as {{ firebaseUser.email }}</p>
          <p v-else>No Firebase user is currently signed in.</p>
          <p v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>
          <button class="btn btn-danger" :disabled="isSubmitting" @click="signout">
            {{ isSubmitting ? 'Logging out...' : 'Log out of Firebase' }}
          </button>
        </template>
      </div>
    </div>
  </main>
</template>
