import { toRef } from 'vue'
export default {
  props: ['modelValue'],
  setup(props){
    console.log('props-props', props)
    const fooRef = toRef(props.modelValue, 'name')
    return {
      fooRef
    }
  },
  render(){
    return (
      <div>
        <div>{this.fooRef}</div>
        <div>{this.modelValue.name}</div>
        <input type="text" vModel={this.modelValue.name}/>
      </div>
    )
  }
}