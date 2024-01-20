<template>
  <div>
    <DemoWrap>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-close-bold"></use>
      </svg>
      <div class="rootColor fin-button">134</div>
      <fin-button>修改</fin-button>
    </DemoWrap>
    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import md from './readme.md?raw'
</script>
<script lang="ts">
export default {
  aliasName: '按钮',
}
</script>

<style scoped>
.rootColor {
  background: var(--fin-primary-color);
}
</style>
