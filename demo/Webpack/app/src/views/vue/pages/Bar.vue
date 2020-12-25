<template>
   <div>
       <H1>BAR</H1>
       <div @click="push">{{ttttttt}}</div>
       <router-view>
           子路由
       </router-view>
   </div>
</template>

<script>
  export default {
    name: "Bar",
    data: function(){
      return {
        ttttttt: 'bar'
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
      console.log('1', this)
    }
  }
</script>

<style scoped>

</style>