<template>
  <el-form
    :model="modelData"
    :rules="rules"
    ref="modelData"
    v-bind="formAttrs"
    :class="`hll-${formItemData.type}`"
  >
    <el-form-item :label="formItemData.label" prop="name">
      <el-date-picker
        type="daterange"
        v-model="modelData.name"
        v-bind="currentAttrs"
        :pickerOptions="pickerOptions"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
import { getDisableDate } from './DatePicker'
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllDateRange',
  mixins: [formItemMinxin],
  computed: {
    pickerOptions(){
      return getDisableDate(this.formItemData, this.formData)
    },
    currentAttrs(){
      return {
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        ...this.attrs
      }
    }
  }
}
</script>

<style scoped>

</style>
