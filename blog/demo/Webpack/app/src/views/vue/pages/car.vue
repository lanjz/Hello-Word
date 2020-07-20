<template>
 <div>
     <H1 @click="han1">CAR</H1>
     <div @click="push">{{ttttttt}}</div>.
     <router-view>
         11
     </router-view>
 </div>
</template>

<script>
  export default {
    name: "Bar",
    data: function(){
      return {
        ttttttt: 'tttttt'
      }
    },
    methods: {
      han1(){
        this.ttttttt = 'han1'
      },
      push() {
        debugger
        this.ttttttt = 'new ttttttt'
        this.$router.push('/foo')
      }
    },
    mounted() {
      console.log('1', this)
    },
    updated() {
      console.log('up-car')
    }
  }
</script>

<style scoped>

</style>