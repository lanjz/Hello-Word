<template>
  <div class="base-app">
    <div class="app-side flex flex-column">
      <div class="app-logo">
       <span style="font-size: 22px">微前端</span>
<!--        <img src="../../assets/image/logo.png" class="logo" alt="logo" />-->
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
        <RouterMap></RouterMap>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Header from './Header'
import Menu from './Menu.js'
import RouterMap from './RouterMap.js'
export default {
  components: {
    Header,
    Menu,
    RouterMap
  },
  computed: {
    ...mapState('userinfo', ['useinfo'])
  },
  methods: {
    ...mapActions('userinfo', ['getUserinfo'])
  },
  mounted() {
    // this.getUserinfo()
  }
}
</script>
<style scoped lang="scss">
.app-logo{
  height: 60px;
  color: #fff;
  line-height: unset;
  padding: 10px;
  .logo{
    height: 40px;
    width: auto;
  }
  .name{
    margin-left: 10px;
    font-size: 14px;
  }
}
</style>

