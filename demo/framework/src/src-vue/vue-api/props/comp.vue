<template>
  <Comp></Comp>
</template>

<script>
export default {
  name: "comp",
  components: {
    Comp: () => import('./comp.vue')
  }
}
</script>

<style scoped>

</style>