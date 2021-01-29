<template>
<div>
  <el-row class="hll-form-wrap" :class="{'inline': inline}" v-if="value">
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
        <slot :name="item.slotType"  v-if="item.type === 'slot'"></slot>
        <render :render="item.render" :item="item" v-if="item.type === 'render'" :formData="value" />
        <component
          v-else
          :is="formMap[item.type]"
          :formAttrs="$attrs"
          :formItemData="item"
          :formData="value"
          v-model="value[item.model]"
        />
      </el-col>
    </template>

  </el-row>
</div>
</template>

<script>
import HllInput from './items/Input'
import HllSelect from './items/Select'
import HllDatePicker from './items/DatePicker'
import HllDateRange from './items/DateRange'
import HllSwitch from './items/Switch'
import HllCheckBox from './items/Checkbox'
import HllRadio from './items/Radio'
import HllTextarea from './items/Textarea'
import HllCascader from './items/Cascader'
import HllInputNumber from './items/InputNumber'
import HllTimePicker from './items/TimePicker'
import HllDateTimePicker from './items/DateTimePicker'
import HllDateTimeRange from './items/DateTimeRange'
import HllUpload from './items/Upload'
import Title_1 from './auxiliary/Title_1'
const formMap = {
  input: 'HllInput',
  select: 'HllSelect',
  datePicker: 'HllDatePicker',
  dateRange: 'HllDateRange',
  switch: 'HllSwitch',
  checkbox: 'HllCheckBox',
  radio: 'HllRadio',
  textarea: 'HllTextarea',
  cascader: 'HllCascader',
  inputNumber: 'HllInputNumber',
  timePicker: 'HllTimePicker',
  timeSelect: 'HllTimePicker',
  dateTimePicker: 'HllDateTimePicker',
  dateTimeRange: 'HllDateTimeRange',
  upload: 'HllUpload',
  title_1: 'Title_1'
}
export default {
  name: "HllForm",
  componentAlias: "HllForm",
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
    HllDateRange,
    HllSwitch,
    HllCheckBox,
    HllRadio,
    HllTextarea,
    HllCascader,
    HllInputNumber,
    HllTimePicker,
    HllDateTimePicker,
    HllDateTimeRange,
    HllUpload,
    Title_1,
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
      this.$children.forEach((child) => {
        if(this.isHllFormItem(child)){
          child.resetFields()
        }
      });
    },
    validate(fn){
      let asyncArr = []
      this.$children.forEach((child) => {
        if(this.isHllFormItem(child) && child.validate){
          asyncArr.push(child.validate())
        }
      });
      Promise.all(asyncArr)
        .then(res => {
          let message = {}
          let valid = true
          let data = {}
          res.forEach(item => {
            const { key, message:itemMessage, valid:itemValid, data: itemData } = item
            Object.assign(data, itemData)
            !itemValid && (message[key] = itemMessage.name)
            if(!itemValid && valid){
              valid = false
            }
          })
          fn(valid, message, data)
        })
    },
    isHllFormItem(child){
      return child.$options.componentAlias === 'HllFormItem'
    },
    getFormData(){
      let data = {}
      this.$children.forEach((child) => {
        if(this.isHllFormItem(child)){
          Object.assign(data, child.getData())
        }
      });
      return data
    },
  },
  mounted() {
    if(!this.value){
      throw new Error('缺少v-model（缺少Form表单绑定）')
    } else if(typeof this.value !== 'object'){
      throw new Error('v-model不是对象')
    }
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
    .hll-select, .hll-select-multiple, .hll-datePicker, .hll-timePicker, .hll-cascader-multiple{
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
