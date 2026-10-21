<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="container mt-5 text-center">
    <div class="alert alert-danger" role="alert">
      <h1 class="h3 alert-heading">Access Denied</h1>
      <template v-if="route.query.reason === 'role-required'">
        <p>This page requires the Librarian role. Your Member account does not have access.</p>
        <router-link to="/account" class="btn btn-primary">Back to dashboard</router-link>
      </template>
      <template v-else>
        <p>You must be logged in to access this members-only page.</p>
        <router-link to="/FireLogin" class="btn btn-primary">Go to Firebase Login</router-link>
      </template>
    </div>
  </div>
</template>
