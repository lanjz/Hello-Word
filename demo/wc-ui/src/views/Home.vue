<template>
  <MdDoc :md="md" :hideIntro="true"></MdDoc>
</template>

<script setup lang="ts">
import md from './Home.md?raw'
</script>

<style scoped>
li {
  color: #666;
  margin-bottom: 10px;
}
</style>
