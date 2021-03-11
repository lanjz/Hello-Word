<template>
  <el-form
    :model="modelData"
    :rules="rules"
    ref="modelData"
    v-bind="formAttrs"
    :class="`hll-${formItemData.type}${formItemData.multiple?'-multiple':''}`"
  >
    <el-form-item :label="formItemData.label" prop="name">
      <el-select v-model="modelData.name" v-bind="attrs" v-if="!formItemData.group">
        <el-option
          v-for="item in formItemData.options"
          :label="item.label"
          :disabled="item.disabled"
          :value="item.value"
          :key="item.value"
        >
          <render
            v-if="typeof formItemData.optionRender === 'function'"
            :render="formItemData.optionRender"
            :formItemData="value"
            :item="item"
          />
        </el-option>
      </el-select>
      <el-select v-model="modelData.name" v-bind="attrs" v-else>
        <el-option-group
          v-for="group in formItemData.options"
          :key="group.label"
          :label="group.label"
        >
          <el-option
            v-for="item in group.options"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          >
            <render
              v-if="!!formItemData.optionRender&&typeof formItemData.optionRender === 'function'"
              :render="formItemData.optionRender"
              :formItemData="value"
              :item="item"
            />
          </el-option>
        </el-option-group>
      </el-select>

    </el-form-item>
  </el-form>
</template>

<script>
import formItemMinxin from './formItemMinxin';
export default {
  name: 'HllSelect',
  data(){
    return {}
  },
  mixins: [formItemMinxin],
  components: {
    render: {
      props: {
        render: Function,
        item: '',
        formItemData: ''
      },
      render (h) {
        return this.render&&this.render(h, this.item, this.formItemData)
      }
    }
  },
}
</script>
