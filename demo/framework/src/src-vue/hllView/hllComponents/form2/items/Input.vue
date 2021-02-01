<template>
  <el-input v-model="formData[key]" v-bind="attrs">
    <template v-if="formItemData.slot&&formItemData.slot.slotName" :slot="formItemData.slot.slotName">
      <render
          v-if="typeof formItemData.slot.render === 'function'"
          :render="formItemData.slot.render"
      />
      <span v-if="formItemData.slot.content">
            {{formItemData.slot.content}}
          </span>
    </template>
  </el-input>
</template>

<script>
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllInput',
  mixins: [formItemMinxin],
  components: {
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
