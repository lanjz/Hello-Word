<template>
  <HelloWorld :user="user" />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import { defineAsyncComponent } from 'vue'
export default {
  name: 'App',
  data(){
    return {
      pop: {
        ttt: 'ffff'
      },
      user:'lanjz'
    }
  },
  components: {
    HelloWorld: defineAsyncComponent(() => import('./jsx/demo') )
  },
  methods: {
    action(){
      alert('action')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
