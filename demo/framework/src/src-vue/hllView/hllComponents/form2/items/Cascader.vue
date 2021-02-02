<template>
  <el-cascader
      v-model="formData[key]"
      v-bind="attrs"
      :options="formItemData.options"
  >
    <template slot-scope="{ node, data }" v-if="!!formItemData.optionRender&&typeof formItemData.optionRender === 'function'">
      <render
          :subRender="formItemData.optionRender"
          :formItemData="value"
          :data="data"
          :node="node"
      />
    </template>
  </el-cascader>
</template>

<script>
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllInput',
  mixins: [formItemMinxin],
  components: {
    render: {
      props: {
        subRender: Function,
        item: '',
        data: '',
        node: '',
      },
      render (h) {
        return this.subRender&&this.subRender(h, this.data, this.node)
      }
    }
  }
}
</script>

<style scoped>

</style>
