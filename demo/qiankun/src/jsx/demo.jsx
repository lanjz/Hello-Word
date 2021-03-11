import { defineComponent, ref } from 'vue'
import List from './list'

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
        <div>test</div>
        <button onClick={this.click}>点击</button>
        <input v-model={this.input} placeholder="啊这"/>
        <List name="lanjz"></List>
      </>
    )
  }

})

export default Demo