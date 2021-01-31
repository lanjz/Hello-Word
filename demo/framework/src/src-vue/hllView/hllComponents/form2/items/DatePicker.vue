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
        type="date"
        v-model="modelData.name"
        v-bind="attrs"
        :pickerOptions="pickerOptions"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
function formatDate(d){
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`
}
export function disFn(min, max){

  return time => {
    let minDate = !!min&&(new Date(formatDate(min))).getTime() > time.getTime()
    let maxDate = !!max&&(new Date(formatDate(max))).getTime() < time.getTime()
    if(min && max){
      return minDate || maxDate
    } else if(min) {
      return minDate
    } else if(max){
      return maxDate
    }
  }
}
export function getDisableDate(formItemData, formData){
  let { 'picker-options': pickerOptions = {}, min, max } = formItemData
  if(typeof max === 'function' ){
    max = max()
  }
  if(typeof min === 'function' ){
    min = min()
  }
  if(pickerOptions && pickerOptions.disabledDate){
    return pickerOptions
  } else if(min || max){
    pickerOptions.disabledDate = disFn(min, max)
  }
  return pickerOptions
}
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllDatePicker',
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
