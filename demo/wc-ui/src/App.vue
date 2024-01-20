<script setup lang="ts">
import AppHeader from './components/Header.vue'
</script>

<template>
  <div class="app-main">
    <AppHeader></AppHeader>
    <div style="width: 1200px; margin: 0 auto">
      <router-view />
    </div>
  </div>
</template>
