<template>
    <h1 v-if="show" id="h1">
      登录
    </h1>
</template>
<script>
export default {
  data(){
    return {
      show: false
    }
  },
  mounted() {
    // console.log(document.getElementById('h1'))

    this.$nextTick(() => {
      console.log(document.getElementById('h1'))
    })
    this.show = true
  }
}
</script>
<style>

</style>