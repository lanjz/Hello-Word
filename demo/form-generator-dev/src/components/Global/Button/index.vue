<template>
<el-button  v-bind="$attrs">
  {{text}}
</el-button>
</template>

<script>
export default {
  name: 'CButton',
  props: ['text']
}
</script>

<style scoped>

</style>
