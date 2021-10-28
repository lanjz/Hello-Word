<template>
  <div style="border: solid 1px #000">
    <h1>{{item.name}}</h1>
    <div style="color: #666">{{item.content}}</div>
  </div>
</template>

<script>
  export default {
    name: "virtualItem",
    props: ['item']
  }
</script>

<style scoped>

</style>