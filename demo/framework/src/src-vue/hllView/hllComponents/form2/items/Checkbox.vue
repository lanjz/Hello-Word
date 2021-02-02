<template>
<div>
  <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      v-if="formItemData.showCheckAll"
  >全选</el-checkbox>
  <el-checkbox-group v-model="formData[key]" v-bind="attrs" @change="handleCheckedCitiesChange" v-if="formItemData.options">
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
</div>
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
      this.formData[this.key] = val ? this.formItemData.options.map(item => item.value) : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.formItemData.options.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.formItemData.options.length;
    }
  },
  created() {
    let val = this.formData[this.key]
    if(!val){
      this.formData[this.key] = []
    }
    if(typeof val === 'string'){t
      this.formData[this.key] = [val]
    }
    if(Object.prototype.toString.call(this.formData[this.key]) !== '[object Array]'){
      console.error(this.key+'的值必须是一个数组')
    }
  }
}
</script>

<style scoped>

</style>
