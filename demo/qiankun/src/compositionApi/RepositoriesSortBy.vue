<template>
<div>
  <h1>SortList</h1>
  <ul>
    <li v-for="(item, index) in repositories" :key="index">
      Name：{{item.name}}
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: "RepositoriesList",
  props: ['repositories']
}
</script>

<style scoped>

</style>