<template>
  <Comp></Comp>
</template>

<script>
export default {
  name: "index",
  provide(){
    return {
      foo: this.item
    }
  },
  data(){
    return {
      item: {
        name: 'f'
      }
    }
  },
  components: {
    Comp: () => import('./comp.vue')
  },
  mounted(){
    console.log('provide-index', this)
  }

}
</script>

<style scoped>

</style>