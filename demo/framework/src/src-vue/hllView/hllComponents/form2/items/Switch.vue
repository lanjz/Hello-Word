<template>
  <el-switch
      v-model="formData[key]"
      v-bind="attrs"
  >
  </el-switch>
</template>

<script>
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllSwitch',
  mixins: [formItemMinxin],
}
</script>

<style scoped>

</style>
