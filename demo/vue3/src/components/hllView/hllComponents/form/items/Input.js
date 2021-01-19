export default {
  name: "HllInput",
  componentAlias: "HllInput",
  props: {
    formItemData: {},
    modelValue: {},
  },
  setup() {},
  render() {
    const { model, slot, ...attrs } = this.formItemData
    return (
      <el-input
        {...attrs}
        vModel={this.modelValue[model]}
        v-slots={slot ? slot() : null}
      >
      </el-input>
    )
  }

}