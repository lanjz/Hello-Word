<template>
  <div class="neat-wrap">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "HllNeat",
  componentAlias: "HllNeat",
}
</script>

<style scoped>
.neat-wrap{
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;
}
</style>
