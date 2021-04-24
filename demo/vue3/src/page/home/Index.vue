<template>
  <div class="app">
    <div class="app-content flex-1 relative flex flex-column">
      <div class="app-head">
        <Menu></Menu>
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
import Menu from './Menu.js'
import RouterMap from './RouterMap.js'
export default {
  components: {
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
  },
  metaInfo: {
    title: 'My Example App', // set a title
    meta: [{                 // set meta
      name: 'keyWords',
      content: 'My Example App'
    }]
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

