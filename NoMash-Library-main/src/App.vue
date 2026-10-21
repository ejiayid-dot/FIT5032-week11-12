<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()
const showHeader = computed(() => !route.meta.jsonApi)
</script>

<template>
  <header v-if="showHeader">
    <BHeader />
  </header>

  <main class="app-content">
    <router-view></router-view>
  </main>
</template>

<style>
.app-content {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
