<template>
  <Comp2></Comp2>
</template>

<script>
export default {
  name: "index",
  data(){
    return {

    }
  },
  components: {
    Comp2: () => import('./comp2.vue')
  },
}
</script>

<style scoped>

</style>