<template>
  <div class="demo-wrap">
    <div class="default-wrap">
      <slot></slot>
    </div>
    <div v-if="slots.config" class="config-wrap">
      <slot name="config"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style scoped>
.demo-wrap {
  display: flex;
}
.default-wrap {
  flex: 1;
  border: solid 1px #f6f4f1;
  padding: 20px;
  border-radius: 4px;
  background: #fff;
}
.config-wrap {
  background: #fff;
  margin-left: 20px;
  padding: 20px;
  border-radius: 4px;
}
</style>
