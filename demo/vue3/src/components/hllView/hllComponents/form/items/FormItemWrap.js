import { reactive, watch, $emit, toRefs } from 'vue'
function getDefaultValue(type){
  return ['checkbox'].includes(type) ? [] : ''
}
export default {
  name: "HllInput",
  componentAlias: "HllInput",
  props: ['formItemData', 'formAttrs', 'modelValue', 'formData'],
  emits: ['input'],
  setup(props) {
    const { modelValue, formItemData } = toRefs(props)
    const modelData = reactive({value: ''})
    watch(modelData, () => {
      $emit('input', modelData.value)
    })
    watch(
      modelValue,
      (val) => {
        modelData.value = typeof val === 'undefined' ? getDefaultValue(formItemData.type) : val
      },
      {deep: true, immediate: true}
      )
    watch(
      formItemData,
      (value) => {
        const { model, type, rules,...attrs } = value
        this.key = model
        this.attrs = attrs
        this.type = type
        this.rules.name = rules || []
      },
      {deep: true, immediate: true}
    )
    return {
      modelData
    }
  },
  render () {
    const { modelData, rules, formItemData, formAttrs } = this
    return (
      <div>
        <div>{modelData.name}</div>
        <el-form
          {...formAttrs}
          model={modelData}
          rules={rules}
          ref="modelData"
          className={`hll-${formItemData.type}`}
        >
          <el-form-item
            label={formItemData.label}
            prop="name"
          >
            <el-input
              vModel={modelData.name}
              v-slots={formItemData.slot ? formItemData.slot() : null}
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>

    )
  }

}