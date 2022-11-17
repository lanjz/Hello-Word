<template>
  <el-form-item
      v-bind="column.itemFormAttr"
      :prop="column.prop"
      :label="column.label"
  >
    <template v-if="column.renderList">
      <el-col :span="c.colSpan||24" v-for="(c, ind) in column.renderList" :key="ind">
        <render
            :form="form"
            v-bind="c"
        />
      </el-col>
    </template>
    <el-col :span="column.colSpan||24" v-else>
      <render
          :form="form"
          v-bind="column"
      />
    </el-col>
  </el-form-item>
</template>

<script>
import Render from "./Render";

export default {
  name: 'FormItem',
  props: {
    column: {
      type: Object,
      default: () => ({}),
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data(){
    return {
      isList: Object.prototype.toString.call(this.column) === '[object Array]'
    }
  },
  components: {
    Render
  },
}
</script>

<style scoped>

</style>