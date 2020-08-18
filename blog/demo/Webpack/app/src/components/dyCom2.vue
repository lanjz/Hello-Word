<template>
    <h2>动态组件一</h2>
</template>
<script>
    export default {
      methods: {
        do(){
          console.log(a)
          a.push(2)
        }
      },
      mounted() {
        console.log('二', this)
      }
    }
</script>