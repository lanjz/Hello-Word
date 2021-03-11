<template>
  <Comp></Comp>
</template>

<script>
import { defineAsyncComponent, computed } from 'vue'
export default {
  name: "index",
  provide(){
    return {
      // foo: this.item,
      foo: computed(() => this.item.name)
    }
  },
  data(){
    return {
      item: {
        name: 'ff'
      }
    }
  },
  components: {
    Comp: defineAsyncComponent(() => import('./comp.vue'))
  },
  mounted(){
    console.log('provide-index', this)
  }

}
</script>

<style scoped>

</style>