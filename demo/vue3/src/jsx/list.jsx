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
        <h1>List</h1>
      </>
    )
  }

})

export default Demo