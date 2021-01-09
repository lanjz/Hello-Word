<template>
  <Menu>
    <MItem index="1-1"><div>选项1</div></MItem>
    <MItem index="1-1"><div>选项1</div></MItem>
    <MItem index="1-1"><div>选项1</div></MItem>
    <MItem index="1-1"><div>选项1</div></MItem>
  </Menu>
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
    Menu: defineAsyncComponent(() => import('./view/menu/index') ),
    MItem: defineAsyncComponent(() => import('./view/menu/MenuItem') ),
  },
  methods: {
    action(){
      alert('action')
    },
    handleOpen(){},
    handleClose(){},
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
