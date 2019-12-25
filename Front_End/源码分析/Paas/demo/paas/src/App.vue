<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<router-view/>-->
    <comment :is="view"></comment>
  </div>
</template>

<script>
  import PageIndex from './page/index.vue'
  export default {
    name: 'App',
    data() {
      return {
        meta: '是谁'
      }
    },
    components: {
      // 'Page': PageIndex
    },
    computed: {
      view() {
        console.log('this.meta', this.meta)
        const vm = this
        return {
          render(createElement) {
            return createElement('Page', {
              props: {
                meta: vm.meta
              }
            })
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
