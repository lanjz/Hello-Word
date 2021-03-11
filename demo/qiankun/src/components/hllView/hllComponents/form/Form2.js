import Input from './items/Input'
import FormItemWrap from "./items/FormItemWrap";

const formMap = {
  input: Input,
}
function RenderCom({item, value}){
  let Com = formMap[item.type]
  if(!Com) return null
  console.log('value', value)
  return (
    <Com
      formItemData={item}
      formData={value}
      vModel={value[item.model]}
    ></Com>
  )
}
console.log('RenderCom', RenderCom)
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
  setup (props) {
    console.log('props', props)
  },
  render () {
    console.log('this', this)
    if(!this.modelValue) return null
    const { itemOffset, itemSpan } = this
    return (
      <el-row className={this.inline ? 'inline' : ''}>
        {
          this.formConfig.map((item, index) => (
            !item.hide && (
              <el-col
                className="hll-form-el-col hll-form-item"
                key={item.model||index}
                style={
                  {
                    marginLeft: ((item.itemOffset||itemOffset||'')+'').indexOf('px')>-1 ? (item.itemOffset||itemOffset) : '',
                    width: ((item.itemSpan||itemSpan||'')+'').indexOf('px')>-1 ? (item.itemSpan||itemSpan) : '',
                  }
                }
                span={((item.itemSpan||itemSpan||'')+'').indexOf('px')<0 ? +(item.itemSpan||itemSpan) : NaN}
                offset={((item.itemOffset||itemOffset||'')+'').indexOf('px')<0 ? +(item.itemOffset||itemOffset) : NaN}
              >
                {
                  item.slot
                    ? (<template v-slots={item.slot()}></template>)
                    : (
                      <FormItemWrap
                        vModel={this.modelValue[item.model]}
                        formItemData={item}
                        value={this.modelValue}
                      ></FormItemWrap>
                    )
                }
              </el-col>
            )
          ))
        }
      </el-row>
    )
  }

}