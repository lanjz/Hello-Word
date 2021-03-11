<template>
<div>
  <h1>List</h1>
  <ul>
    <li v-for="(item, index) in repositories" :key="index">
      {{index}}、User: {{item.user}} - Name：{{item.name}}
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