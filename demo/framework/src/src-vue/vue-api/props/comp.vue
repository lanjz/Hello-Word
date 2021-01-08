<template>
  <h1 :da="test" @click="action">Props</h1>
</template>

<script>
export default {
  name: "comp",
  // props: ['da'],
  data(){
    return {
      test: '圭',
      attrs: {
        da: 'fuck'
      }
    }
  },
  computed: {
 /*   da(){
      return 'hhhhhh'
    },*/
    attrs2(){
      return {
        da: 'fuck'
      }
    }
  },
  methods: {
    action(){
      alert(2)
      // this.$listeners.click()
    }
  },
  mounted() {
    console.log('this', this)
    console.log('this.$attrs', this.$attrs)
    console.log('this.$listeners', this.$listeners)
    this.test='哈'
  }
}
</script>

<style scoped>

</style>