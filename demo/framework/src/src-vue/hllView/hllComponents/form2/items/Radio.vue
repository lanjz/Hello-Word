<template>
  <el-form :model="modelData" :rules="rules" ref="modelData" v-bind="formAttrs">
    <el-form-item :label="formItemData.label" prop="name">
      <el-radio-group v-model="modelData.name" v-bind="attrs">
        <component
          v-for="item in formItemData.options"
          v-bind="item"
          :is="!!formItemData.useButton ? 'el-radio-button' : 'el-radio'"
          :label="item.value"
          name="type"
          :key="item.value"
        >{{item.label}}</component>
      </el-radio-group>
    </el-form-item>
  </el-form>
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
