<template>
    <h1>
      Home{{count}}
    </h1>
</template>
<script>
export default {
  data(){
    return {
      count: {
        abc: 1
      }
    }
  },
  mounted() {
    console.log('--', this)
  }
}
</script>
<style>

</style>