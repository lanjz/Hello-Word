<template>
  <Hello name="lanjz"></Hello>
</template>
<script>
import Hello from './HelloWorld'
export default {
  data(){
    return {
      count: {
        abc: 1
      }
    }
  },
  components: {
    Hello
  },
  mounted() {
    console.log('--', this)
  }
}
</script>
<style>

</style>