<template>
  <el-form
    :model="modelData"
    :rules="rules"
    ref="modelData"
    v-bind="formAttrs"
    :class="`hll-${formItemData.type}${formItemData.props&&formItemData.props.multiple?'-multiple':''}`"
  >
    <el-form-item :label="formItemData.label" prop="name">
      <el-cascader
        v-model="modelData.name"
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
    </el-form-item>
  </el-form>
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
