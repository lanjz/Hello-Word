<template>
    <div>
        <div v-for="(item, ind) in t" :key="ind"></div>
    </div>
</template>

<script>
  export default {
    name: "diff",
    data(){
      return {
        t: [1,2,3,4,5]
      }
    },
    mounted() {
      console.log(this)
    }
  }
</script>

<style scoped>

</style>