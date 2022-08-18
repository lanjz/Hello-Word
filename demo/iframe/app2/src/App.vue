<template>
  <div id="app">
    <a href="https://www.baidu.com/">外链</a>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <button @click="post">push</button>
    <button @click="go">测试 Go</button>
    <button @click="back">back</button>
    <button @click="routerBack">router back</button>
    <button @click="routerReplace">router replace</button>
    <router-view/>

  </div>
</template>
<script>
import './abcd'
export default {
  methods: {
    routerReplace(){
      this.$router.replace({
        path: '/about',
        query: {
          name: 123
        }
      })
    },
    routerBack(){
      this.$router.back()
    },
    back(){
      window.history.back()
    },
    go(){
      window.history.go(-1)
    },
    post(){
      this.$router.push({
        path: '/about',
        query: {
          name: 123
        }
      })
      // iframe

    }
  },
  mounted() {

  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
