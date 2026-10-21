<script setup>
import { firebaseUser, firebaseRole, roleLabel } from '../firebaseAuth'
</script>

<template>
  <main v-if="firebaseUser" class="container mt-5">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <span class="badge text-bg-success mb-3">Signed in with Firebase</span>
        <h1 class="h3">{{ roleLabel }} Dashboard</h1>
        <dl class="row mt-4">
          <dt class="col-sm-3">Email</dt>
          <dd class="col-sm-9">{{ firebaseUser.email }}</dd>
          <dt class="col-sm-3">User UID</dt>
          <dd class="col-sm-9 text-break">{{ firebaseUser.uid }}</dd>
          <dt class="col-sm-3">Role</dt>
          <dd class="col-sm-9">{{ roleLabel }}</dd>
        </dl>
        <h2 class="h5">Your access</h2>
        <ul>
          <li>Member area: available</li>
          <li>Librarian area: {{ firebaseRole === 'librarian' ? 'available' : 'restricted' }}</li>
        </ul>
        <div class="d-flex gap-2">
          <router-link to="/about" class="btn btn-primary">Member area</router-link>
          <router-link
            v-if="firebaseRole === 'librarian'"
            to="/librarian"
            class="btn btn-outline-primary"
            >Librarian area</router-link
          >
          <router-link to="/FireLogout" class="btn btn-outline-danger">Log out</router-link>
        </div>
      </div>
    </div>
  </main>
</template>
