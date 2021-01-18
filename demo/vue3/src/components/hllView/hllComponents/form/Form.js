import { ref } from 'vue'
import Input from './items/Input'
const formMap = {
  input: Input,
}

function layout({inline, itemOffset, itemSpan, globalOffset, globalSpan}){
  let attr = {
    style: {}
  }
  let span = ''
  let offset = itemOffset || globalOffset || ''
  if(offset&&(offset+'').indexOf('px') < -1){ // 为纯数字，设置珊格属性
    attr.offset = offset
  } else { // 带px 设置样式
    style.marginLeft =offset
  }
  if(inline){ // 如果设置了表单为内联形式，则不设置栅格
    return attr
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
  const offset = itemOffset || globalOffset || ''
  let Item = formMap[type]
  if(Item || itemSlot){
    const getSpan = itemSpan || globalSpan || ''
    let span = 24
    if(inline){
      span = null
    } else if(getSpan){
      span = {span &&(span+'').indexOf('px')<0 ? +span : null}
    }
    return (
      <el-col
        key={itemData.model}
        style={
          {
            marginLeft: (offset+'').indexOf('px')>-1 ? offset : '',
            width: (span+'').indexOf('px')>-1 ? span : '',
          }
        }
        span={span&&(span+'').indexOf('px')<0 ? +span : null}
        offset={offset&&(offset+'').indexOf('px')<0 ? +offset : null}
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
      <el-form model={this.modelValue} ref="hllViewFrom" inline={this.inline}>
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