<template>
  <el-radio-group v-model="formData[key]" v-bind="attrs">
    <component
        v-for="item in formItemData.options"
        v-bind="item"
        :is="!!formItemData.useButton ? 'el-radio-button' : 'el-radio'"
        :label="item.value"
        name="type"
        :key="item.value"
    >{{item.label}}</component>
  </el-radio-group>
</template>

<script>
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllRadio',
  mixins: [formItemMinxin],
}
</script>

<style scoped>

</style>
