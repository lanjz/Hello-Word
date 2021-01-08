<template>
<div>
  搜索
  <div>
    姓名：<input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
  </div>
</div>
</template>

<script>
export default {
  name: "RepositoriesFilters",
  props: ['modelValue'],
  data(){},
  mounted() {
    console.log('this0', this.$attrs)
  }
}
</script>

<style scoped>

</style>