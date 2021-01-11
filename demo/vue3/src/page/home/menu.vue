<template>
  <el-menu
      style="border-right: none"
      :uniqueOpened="true"
      :default-active="defaultActive"
      background-color="#001529"
      text-color="#c0c4cc"
      active-text-color="#fff"
      @select="pushRouter"
  >
    <template v-for="(item, index) in menuList" :key="index">
      <el-submenu v-if="item.children&&item.children.length" :index="'/'+item.path">
        <template #title>
          <i class="el-icon-location"></i>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item :index="'/'+item.path+'/'+subItem.path" v-for="(subItem, subindex) in item.children" :key="subindex">
          {{subItem.name}}
        </el-menu-item>
      </el-submenu>
      <el-menu-item :index="'/'+item.path" v-else>
        <i class="el-icon-menu"></i>
        <template #title>
          <span>{{item.name}}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
import menu from '../../router/home'
import { useRouter, useRoute } from 'vue-router'
export default {
  setup(){
    const router = useRouter()
    const route = useRoute()
    const defaultActive = route.path.substring(5) || '/'
    function pushRouter(key) {
      const path = '/home'+key
      if(path !== route.path){
        router.push({
          path
        })
      }
    }
    return {
      menuList: menu.children,
      defaultActive,
      pushRouter
    }
  }
}
</script>
<style scoped lang="scss">
:deep.el-menu-item.is-active{
  background: #ff5103 !important;
}
</style>