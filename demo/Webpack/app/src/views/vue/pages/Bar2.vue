<template>
   <div>
       <H1>BAR-2</H1>
       <div @click="push">{{bar2}}</div>
   </div>
</template>

<script>
  export default {
    name: "bar2",
    data: function(){
      return {
        bar2: 'bar2'
      }
    },
    methods: {
      push() {
        debugger
        // this.ttttttt = 'new ttttttt'
        this.$router.push('/foo')
      }
    },
    mounted() {
      console.log('bar1', this)
    }
  }
</script>

<style scoped>

</style>