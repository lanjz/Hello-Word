<template>
  <Comp2></Comp2>
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
  name: "index",
  data(){
    return {}
  },
  components: {
    Comp2: defineAsyncComponent(() => import('./comp2.vue'))
  },
}
</script>

<style scoped>

</style>