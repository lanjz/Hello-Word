<template>
  <h1>
    {{foo}}
  </h1>
</template>

<script>
export default {
  name: "index",
  inject: ['foo'],
}
</script>

<style scoped>

</style>