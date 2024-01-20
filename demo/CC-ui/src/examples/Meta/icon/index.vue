<template>
  <div>
    <DemoWrap>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-close-bold"></use>
      </svg>
      <fin-icon name="close"></fin-icon>
    </DemoWrap>
    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import md from './readme.md?raw'
</script>
<script lang="ts">
export default {
  aliasName: '图标',
}
</script>

<style scoped></style>
