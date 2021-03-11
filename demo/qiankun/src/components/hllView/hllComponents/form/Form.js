import { ref } from 'vue'
import Input from './items/Input'
import DatePicker from './items/DatePicker'
import Radio from './items/Radio'
import Select from './items/Select'
import './hll-form.scss'
const formMap = {
  input: Input,
  datePicker: DatePicker,
  radio: Radio,
  select: Select,
}

function setLayout(data){
  const {inline, itemOffset, itemSpan, globalOffset, globalSpan} = data
  let style = {}
  let span = itemSpan || globalSpan || (inline ? NaN : 24)
  let offset = itemOffset || globalOffset || NaN
  if(offset){
    if((offset+'').indexOf('px') > -1){ // 带px 设置样式
      style.marginLeft = offset
      offset = undefined
    } else {
      offset = +offset // 设置珊格需要为number 类型
    }
  }
  if(span){
    if((span+'').indexOf('px') > -1){ // 带px设置样式
      style.width = offset
      style.flex = 'none'
      span = undefined
    } else {
      span = +span  // 设置珊格需要为number 类型
    }
  }
  const result = { style }
  if(offset){
    result.offset = offset
  }
  if(inline){ // 如果设置了表单为内联形式，则不设置栅格
    result.style.flex='none'
    return result
  } else {
    if(span){
      result.span = span
    }
    return result
  }
}

function RenderItem({ inline, formItemData, formData, globalOffset, globalSpan }){
  const {
    itemSlot,
    type,
    rules,
    label,
    itemOffset,
    itemSpan,
    ...itemData // 运用表单项中的属性
  } = formItemData
  let Item = formMap[type]
  if(Item || itemSlot){
    const layoutAttr = setLayout({ inline,itemOffset, itemSpan, globalOffset, globalSpan })
    return (
      <el-col
        key={itemData.model}
        {...layoutAttr}
      >
        {
          itemSlot
            ? <template v-slots={itemSlot()}></template>
            : (
              <el-form-item label={label||''}  prop={itemData.model} rules={rules}>
                <Item
                  vModel={formData}
                  formItemData={itemData}
                ></Item>
              </el-form-item>
            )
        }
      </el-col>
    )
  }
  return null
}
export default {
  name: "HllForm",
  componentAlias: "HllForm",
  props: {
    formConfig: Array,
    modelValue: Object,
    inline: Boolean,
    itemSpan: {},
    itemOffset: {},
  },
  setup () {
    const hllViewFrom = ref(null)
    function validate(){
      return new Promise(resolve => {
        hllViewFrom.value.validate((result, message) => {
          resolve({result, message})
        })
      })
    }
    function resetFields(){
      return hllViewFrom.value.resetFields()
    }
    function clearValidate(){
      return hllViewFrom.value.clearValidate()
    }
    return {
      hllViewFrom,
      validate,
      resetFields,
      clearValidate
    }
  },
  render () {
    if(!this.modelValue) return null
    return (
      <el-form class="hll-form-container" model={this.modelValue} ref="hllViewFrom" inline={this.inline}>
        <el-row>
          {
            this.formConfig.map((item, index) => (
              !item.hide && (
                <RenderItem
                  inline={this.inline}
                  globalOffset={this.itemOffset}
                  globalSpan={this.itemSpan}
                  formItemData={item}
                  formData={this.modelValue}
                  key={item.model||index}
                ></RenderItem>
              )
            ))
          }
        </el-row>
      </el-form>

    )
  }
}