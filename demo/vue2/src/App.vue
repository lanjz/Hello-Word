<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>
    <h1 @click="log">ABC</h1>=
    <div>{{name}}</div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      name: ''
    }
  },
  methods: {
    sssssssssssssssssssss(res){
      console.log('sssssssssssssssssssss', res)
      this.name = res.default.a
    },
    log(){
      import('./ab').then(res => {
        this.sssssssssssssssssssss(res)
      })
    }
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
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
