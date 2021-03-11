export default {
  name: "HllSelect",
  componentAlias: "HllSelect",
  props: {
    formItemData: {},
    modelValue: {},
  },
  setup() {},
  render() {
    const { model, group, options, slot,  ...attrs } = this.formItemData
    if(group){
      return (
        <el-select
          {...attrs}
          vModel={this.modelValue[model]}
        >
          {
            options.map(group => (
              <el-option
                {...group}
                key={group.value}
                label={group.value}
              >
                {
                  group.options.map(item => (
                    <el-option
                      {...item}
                      key={item.value}
                      label={item.value}
                      v-slots={slot ? slot : null}
                    >
                    </el-option>
                  ))
                }
              </el-option>
            ))
          }
        </el-select>
      )
    }
    return (
      <el-select
        {...attrs}
        vModel={this.modelValue[model]}
      >
        {
          options.map(item => (
            <el-option
              {...item}
              key={item.value}
              label={item.value}
              v-slots={slot ? slot(item) : null}
            >
            </el-option>
          ))
        }
      </el-select>
    )
  }

}