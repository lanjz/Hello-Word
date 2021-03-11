import { reactive, watch, toRefs } from 'vue'
function getDefaultValue(type){
  return ['checkbox'].includes(type) ? [] : ''
}
export default {
  name: "HllFormItemWrap",
  componentAlias: "HllFormItemWrap",
  props: {
    formItemData: Object, // 每个表单项的属性
    formAttrs: Object, // 表单属性
    modelValue: {}, // 绑定的值
    formData: Object, // 整个表单的值
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue, formItemData } = toRefs(props)
    const modelData = reactive({value: ''})
    const formRules = reactive({value: []})
    const itemInfo = reactive({
      value: '',
      type: '',
      model: '',
      attrs: {}
    })
    watch(modelData, () => {
      emit('update:modelValue', modelData.value)
    })
    // 外部值发生变化时，内部需要更新
    watch(
      modelValue,
      (val) => {
        modelData.value = typeof val === 'undefined' ? getDefaultValue(formItemData.type) : val
      },
      {deep: true, immediate: true}
    )
    // 属性配置发生变化时，内部也需要做相处处理
    watch(
      formItemData,
      (value) => {
        const { model, type, rules,...attrs } = value
        itemInfo.attrs = attrs
        itemInfo.model = model
        itemInfo.type = type
        console.log('rules', rules)
        formRules.value = rules || []
      },
      {deep: true, immediate: true}
    )
    return {
      formAttrs: itemInfo.attrs,
      modelData,
      formRules,
      itemInfo
    }
  },
  render () {
    const { modelData, formRules, formItemData, formAttrs, itemInfo } = this
    console.log('formRules', formRules)
    console.log('formAttrs', formAttrs)
    return (
      <div>
        <el-form
          {...formAttrs}
          model={modelData}
          rules={formRules}
          ref="modelDataForm"
          className={`hll-${formItemData.type}`}
        >
          <el-form-item label={formItemData.label} prop="value">
            <el-input
              {...itemInfo.attrs}
              vModel={modelData.value}
              v-slots={formItemData.slot ? formItemData.slot() : null}
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    )
  }
}