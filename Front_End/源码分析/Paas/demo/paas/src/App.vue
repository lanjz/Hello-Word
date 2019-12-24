<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<router-view/>-->
    <comment :is="view"></comment>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      meta: '是谁'
    }
  },
  computed: {
    view() {
      const vm = this
      return {
        render(createElement) {
          return createElement('div', {
            props: {
              meta: this.meta
            }
          }, 'VIEW组件加载了'+vm.meta)
        },
        props: {
          meta: String
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.meta = 'lanjz'
    }, 2000)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
