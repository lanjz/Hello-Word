<template>
  <el-form
    :model="modelData"
    :rules="rules"
    ref="modelData"
    v-bind="formAttrs"
    :class="`hll-${formItemData.type}${formItemData['is-range'] ? '-range': ''}`"
  >
    <el-form-item :label="formItemData.label" prop="name">
      <component :is="formItemData.type === 'timeSelect' ? 'el-time-select': 'el-time-picker'"
        :is-range="formItemData['is-range']"
        v-model="modelData.name"
        v-bind="attrs"
      ></component>
    </el-form-item>
  </el-form>
</template>

<script>
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllDatePicker',
  mixins: [formItemMinxin],
}
</script>

<style scoped>

</style>
