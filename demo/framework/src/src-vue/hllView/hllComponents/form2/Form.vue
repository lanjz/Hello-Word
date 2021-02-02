<template>
  <el-form
      :class="{'inline': inline}"
      :model="value"
      ref="el-form"
      v-bind="$attrs"
  >
    <template v-for="(item, index) in formConfig">
      <el-col
          class="hll-form-el-col hll-form-item"
          :key="item.model||index"
          :style="{
          marginLeft: ((item.itemOffset||itemOffset)&&((item.itemOffset||itemOffset)+'').indexOf('px')>-1) ? (item.itemOffset||itemOffset) : '',
          width: ((item.itemSpan||itemSpan)&&((item.itemSpan||itemSpan)+'').indexOf('px')>-1) ? (item.itemSpan||itemSpan) : '',
        }"
          :span="((item.itemSpan||itemSpan)&&((item.itemSpan||itemSpan)+'').indexOf('px')<0) ? +(item.itemSpan||itemSpan) : NaN"
          :offset="((item.itemOffset||itemOffset)&&((item.itemOffset||itemOffset)+'').indexOf('px')<0) ? +(item.itemOffset||itemOffset) : NaN"
          v-if="!item.hide"
      >
        <el-form-item
            :label="item.label"
            prop="name"
            :class="[
                `${item.isRange ? 'hll-'+item.formType+'-range': 'hll-'+item.formType }`,
                `${item.type? 'hll-'+item.formType+'-'+item.type:  'hll-'+item.formType+'-default'}`,
            ]"
            :rules="item.rules"
        >
          <slot :name="item.slotType"  v-if="item.formType === 'slot'"></slot>
          <render :render="item.render" :item="item" v-else-if="item.formType === 'render'" :formData="value" />
          <component
              v-else-if="formMap[item.formType]"
              :is="formMap[item.formType]"
              :formItemData="item"
              :formData="value"
          />
        </el-form-item>
      </el-col>
    </template>

  </el-form>
</template>

<script>
import HllInput from './items/Input'
import HllSelect from './items/Select'
import HllDatePicker from './items/DatePicker'
import HllSwitch from './items/Switch'
import HllCheckBox from './items/Checkbox'
import HllRadio from './items/Radio'
import HllCascader from './items/Cascader'
import HllInputNumber from './items/InputNumber'
import HllTimePicker from './items/TimePicker'
import HllUpload from './items/Upload'
import Title_1 from './auxiliary/Title_1'
import IndexContent from './auxiliary/IndexContent'
const formMap = {
  input: 'HllInput',
  select: 'HllSelect',
  datePicker: 'HllDatePicker',
  timePicker: 'HllTimePicker',
  timeSelect: 'HllTimePicker',
  switch: 'HllSwitch',
  checkbox: 'HllCheckBox',
  radio: 'HllRadio',
  cascader: 'HllCascader',
  inputNumber: 'HllInputNumber',
  upload: 'HllUpload',
  indexTitle: 'IndexContent',
  title_1: 'Title_1',
}
export default {
  name: "HForm",
  componentAlias: "HForm",
  props: {
    formConfig: Array,
    value: Object,
    inline: Boolean,
    itemSpan: {},
    itemOffset: {},
  },
  components: {
    HllInput,
    HllSelect,
    HllDatePicker,
    HllSwitch,
    HllCheckBox,
    HllRadio,
    HllCascader,
    HllInputNumber,
    HllTimePicker,
    HllUpload,
    Title_1,
    IndexContent,
    render: {
      props: {
        render: Function,
        item: '',
        formData: ''
      },
      render (h) {
        return this.render&&this.render(h, this.item, this.formData)
      }
    }
  },
  data(){
    return {
      formMap,
    };
  },
  methods: {
    resetFields() {
      this.$refs['el-form'].resetFields()
    },
    validate(fn){
      this.$refs['el-form'].validate(fn)
    },
    getFormData(){
      return this.value
    },
  },
  mounted() {
    if(!this.value){
      throw new Error('缺少v-model（缺少Form表单绑定）')
    } else if(typeof this.value !== 'object'){
      throw new Error('v-model不是对象')
    }
    console.log('-', this.$refs['el-form'])
  }
}
</script>


<style scoped lang="scss">
.inline{
  .hll-form-el-col{
    display: inline-block;
    margin-right: 5px;
    width: auto;
  }
}
/*内联表单下的样式*/
.inline{
  ::v-deep{
    .el-form-item{
      margin-bottom: 10px;
    }
    .hll-input {
      width: 150px;
    }
    .hll-timePicker-range, .hll-dateRange{
      width: 305px;
    }
    .hll-select, .hll-select-multiple, .hll-datePicker-default, .hll-timePicker-default, .hll-cascader-multiple{
      width: 200px;
    }
    .hll-select-multiple{
      .el-tag:first-child{
        .el-select__tags-text{
          display: inline-block;
          width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          float: left;
        }
      }

    }
    .hll-cascader-multiple{
      .el-tag:first-child{
        span:first-child{
          display: inline-block;
          width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          float: left;
        }
      }
      .el-cascader__search-input{
        min-width: 20px;
      }
    }
  }
}
::v-deep{
  .el-form-item__content{
    //line-height: normal;
  }
}
</style>
