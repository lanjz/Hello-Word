<template>
   <div>
       <H1>BAR-1</H1>
       <div @click="push">{{bar1}}</div>
   </div>
</template>

<script>
  export default {
    name: "bar1",
    data: function(){
      return {
        bar1: 'bar1'
      }
    },
    methods: {
      push() {
        debugger
        // this.ttttttt = 'new ttttttt'
        this.$router.push('/bar/bar2')
      }
    },
    mounted() {
      console.log('bar1', this)
    }
  }
</script>

<style scoped>

</style>