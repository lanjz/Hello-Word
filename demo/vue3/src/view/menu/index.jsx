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
  render () {
    return (
      <>
        <div>{this.$slots.default()}</div>
      </>
    )
  }

})

export default Demo