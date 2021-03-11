<template>
  <el-form
    :model="modelData"
    :rules="rules"
    ref="modelData"
    v-bind="formAttrs"
    :class="`hll-${formItemData.type}`"
  >
    <el-form-item :label="formItemData.label" prop="name">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        v-if="formItemData.showCheckAll"
      >全选</el-checkbox>
      <el-checkbox-group v-model="modelData.name" v-bind="attrs" @change="handleCheckedCitiesChange">
        <component
          v-for="item in formItemData.options"
          v-bind="item"
          :is="!!formItemData.useButton ? 'el-checkbox-button' : 'el-checkbox'"
          :label="item.value"
          name="type"
          :key="item.value"
        > {{item.label}}
        </component>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllCheckbox',
  mixins: [formItemMinxin],
  data() {
    return {
      checkAll: false,
      isIndeterminate: true
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.modelData.name = val ? this.formItemData.options.map(item => item.value) : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.formItemData.options.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.formItemData.options.length;
    }
  }
}
</script>

<style scoped>

</style>
