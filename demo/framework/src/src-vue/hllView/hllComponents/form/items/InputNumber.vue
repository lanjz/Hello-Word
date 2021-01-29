<template>
  <el-form
    :model="modelData"
    :rules="rules"
    ref="modelData"
    v-bind="formAttrs"
    :class="`hll-${formItemData.type}`"
  >
    <el-form-item :label="formItemData.label" prop="name">
      <el-input-number v-model="modelData.name" v-bind="attrs"></el-input-number>
    </el-form-item>
  </el-form>
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
