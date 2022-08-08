<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  <div>  {{chooose}}</div>
    <virtualScrollSelect
        :data="list"
        v-model="chooose"
    />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import virtualScrollSelect from './components/virtual-scroll-select.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    virtualScrollSelect
  },
  data(){
    return {
      list: [],
      chooose: ''
    }
  },
  mounted(){
    let arr = []
    for(let i = 0; i<100; i++){
      arr.push({
        label: 'label' + i,
        value: 'value' + i,
        code: 'code' + i,
      })
    }
    this.list = arr
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
