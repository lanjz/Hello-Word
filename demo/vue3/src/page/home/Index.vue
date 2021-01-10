<template>
  <div class="app">
    <div class="app-side flex flex-column">
      <div class="app-logo flex align-center">
        <img src="https://i.gtimg.cn/club/item/face/img/8/15918_100.gif" class="logo" alt="logo" />
        <span class="name">VUE-Admin</span>
      </div>
      <div class="app-menu flex-1">
        <Menu></Menu>
      </div>
    </div>
    <div class="app-content flex-1 relative flex flex-column">
      <div class="app-head">
        <Header/>
      </div>
      <div class="app-main flex-1">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import Header from './Header'
import Menu from './menu'
export default {
  components: {
    Header,
    Menu
  },
  mounted(){
    console.log(this)
  }
}
</script>

