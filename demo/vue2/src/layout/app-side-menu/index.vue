<template>
  <div class="app-nav global-flex-column">
    <el-menu
        :default-active="activeMenu"
        background-color="#fff"
        :unique-opened="true"
        mode="vertical"
        @select="select"
    >
      <menu-item
          v-for="route in menuList"
          :key="route.path"
          :item="route"
      />
    </el-menu>
  </div>
</template>

<script>
import MenuItem from "./menu-item"
import { routes, fillRouterPath, dynamicRoutes } from '@/router'
export default {
  name: 'SideMenu',
  components: { MenuItem },
  data() {
    return {
      menuList: [ ...fillRouterPath(routes), ...dynamicRoutes ],
      isCollapse: false,
      activeMenu: this.$route.matched[1] ? this.$route.matched[1].path: this.$route.path,
    }
  },
  watch: {
    '$route': function (){
      this.activeMenu = this.$route.matched[1] ? this.$route.matched[1].path: this.$route.path
    }
  },
  methods: {
    select(key){
      console.log('key', key)
      this.$router.push(key).catch(() =>{})
    },
  }
}
</script>
<style scoped lang="scss">
.app-nav{
  width: 180px;
  flex-shrink: 0;
  border-right: solid 1px #c4c0c0;
  .scroll{
    height: 0;
    overflow: auto;
  }
}

</style>
