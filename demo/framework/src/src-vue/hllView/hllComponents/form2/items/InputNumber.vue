<template>
  <el-input-number v-model="formData[key]" v-bind="attrs"></el-input-number>
</template>

<script>
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllInputNumber',
  mixins: [formItemMinxin]
}
</script>

<style scoped>

</style>
