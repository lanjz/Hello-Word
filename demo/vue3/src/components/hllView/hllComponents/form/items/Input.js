export default {
  name: "HllInput",
  componentAlias: "HllInput",
  props: {
    formItemData: {},
    modelValue: {},
  },
  setup () {},
  render () {
    const { modelValue } = this
    const { model, slot, ...attrs } = this.formItemData
    return (
      <el-input
        {...attrs}
        vModel={modelValue[model]}
        v-slots={slot ? slot() : null}
      >
      </el-input>
    )
  }

}