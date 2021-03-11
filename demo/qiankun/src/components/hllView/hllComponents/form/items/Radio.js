export default {
  name: "HllRadio",
  componentAlias: "HllRadio",
  props: {
    formItemData: {},
    modelValue: {},
  },
  setup() {},
  render() {
    const { model, useButton,options,  ...attrs } = this.formItemData
    return (
      <el-radio-group
        {...attrs}
        disabledDate={this.disabledDate}
        vModel={this.modelValue[model]}
      >
        {
          useButton
          ? options.map(item => (
              <el-radio-button
                {...item}
                key={item.value}
                label={item.value}
              >
                {item.label}
              </el-radio-button>
            ))
          :
            options.map(item => (
              <el-radio
                {...item}
                key={item.value}
                label={item.value}
              >
                {item.label}
              </el-radio>
            ))
        }
      </el-radio-group>
    )
  }

}