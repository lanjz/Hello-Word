<template>
  <Comp type="name" v-bind="pop" da="da" @da="action" @click.native="action"></Comp>
</template>

<script>
export default {
  name: "index",
  data(){
    return {
      pop: {
        da: ''
      }
    }
  },
  components: {
    Comp: () => import('./comp.vue')
  },
  methods: {
    action(){
      alert('')
    }
  }

}
</script>

<style scoped>

</style>