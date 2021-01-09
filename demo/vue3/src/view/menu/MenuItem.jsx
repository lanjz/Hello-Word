import { defineComponent, ref } from 'vue'

const Demo = defineComponent({
  name: 'demo',
  setup (props) {
    console.log('props', props)
    const input = ref(null)
    const click = (e) => {
      console.log(e)
      console.log(input.value)
    }
    return {
      click,
      input
    }
  },
  onMounted(){
    console.log('this', this)
  },
  render () {
    console.log('this..$slots', this.$slots)
    return (
      <>
        <div>{this.$slots.default({name: 'lanjx'})}</div>
      </>
    )
  }

})

export default Demo