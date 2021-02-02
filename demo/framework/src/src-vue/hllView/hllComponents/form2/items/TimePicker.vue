<template>
  <component
      :is="formItemData.type === 'timeSelect' ? 'el-time-select': 'el-time-picker'"
      :is-range="formItemData['is-range']"
      v-model="formData[key]"
      v-bind="attrs"
  ></component>
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
