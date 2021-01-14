
import formItemMinxin from "@/components/hllView/hllComponents/form/items/formItemMinxin";

export default {
  name: "HllInput",
  componentAlias: "HllInput",
  mixins: [formItemMinxin],
  props: {
    formConfig: Array,
    value: Object,
    inline: Boolean,
    itemSpan: {},
    itemOffset: {},
  },
  setup () {
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