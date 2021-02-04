<template>
  <div v-bind="$attrs" :name="de" name2="de">
    Hello World {{de}}
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data(){
    return {
      de: 'aa'
    }
  },
  mounted() {
    console.log('-----', this)
  }
}
</script>

<style scoped>

</style>