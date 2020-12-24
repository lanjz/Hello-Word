<template>
  <div class="index-anchor">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "IndexAnchor",
  componentAlias: "IndexAnchor",
}
</script>

<style scoped>
.index-anchor{
  position: sticky;
  top: 0;
}
</style>