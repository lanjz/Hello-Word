<template>
  <el-form
    :model="modelData"
    :rules="rules"
    ref="modelData"
    v-bind="formAttrs"
    :class="`hll-${formItemData.type}`"
  >
    <el-form-item :label="formItemData.label" prop="name">
      <HllUpload v-model="modelData.name" v-bind="attrs"></HllUpload>
    </el-form-item>
  </el-form>
</template>

<script>
import formItemMinxin from './formItemMinxin';
import HllUpload from '../../upload/HllUpload'
export default {
  name: 'HllInput',
  mixins: [formItemMinxin],
  components: {
    HllUpload,
    render: {
      props: {
        render: Function,
      },
      render (h) {
        return this.render&&this.render(h)
      }
    }
  },
}
</script>

<style scoped>

</style>
