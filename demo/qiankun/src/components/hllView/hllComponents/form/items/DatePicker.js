function formatDate(d){
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`
}
export function disFn(min, max){
  return time => {
    let minDate = !!min&&(new Date(formatDate(min))).getTime() > time.getTime()
    let maxDate = !!max&&(new Date(formatDate(max))).getTime() < time.getTime()
    if(min && max){
      return minDate || maxDate
    } else if(min) {
      return minDate
    } else if(max){
      return maxDate
    }
  }
}
export function getDisableDate(formItemData){
  let { 'disabled-date': disabledDate, min, max } = formItemData
  if(disabledDate){
    return disabledDate
  }
  if(typeof max === 'function' ){
    max = max()
  }
  if(typeof min === 'function' ){
    min = min()
  }
   else if(min || max){
    disabledDate = disFn(min, max)
  }
  return disabledDate
}

export default {
  name: "HllDatePicker",
  componentAlias: "HllDatePicker",
  props: {
    formItemData: {},
    modelValue: {},
  },
  setup(props) {
    const disabledDate = getDisableDate(props.formItemData)
    return {
      disabledDate
    }
  },
  render() {
    const { model, ...attrs } = this.formItemData
    return (
      <el-date-picker
        {...attrs}
        disabledDate={this.disabledDate}
        vModel={this.modelValue[model]}
      >
      </el-date-picker>
    )
  }

}