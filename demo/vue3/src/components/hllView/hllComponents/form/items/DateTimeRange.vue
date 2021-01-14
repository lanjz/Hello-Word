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
        type="datetimerange"
        v-model="modelData.name"
        v-bind="attrs"
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
    }
  }
}
</script>

<style scoped>

</style>
