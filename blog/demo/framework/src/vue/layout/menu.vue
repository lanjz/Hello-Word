<template>
  <el-menu
      style="border-right: none"
      :default-active="defaultActive"
      @select="selectMenu"
      background-color="#001529"
      text-color="#c0c4cc"
  >
    <div v-for="(item, index) in menu" :key="index">
      <el-submenu v-if="item.children&&item.children.length" :index="'/'+item.path">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item :index="'/'+item.path+'/'+subItem.path" v-for="(subItem, subindex) in item.children" :key="subindex">
          {{subItem.name}}
        </el-menu-item>
      </el-submenu>
      <el-menu-item :index="'/'+item.path" v-else>
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </div>

  </el-menu>
</template>
<script>
import { home as menu } from '../router'
export default {
  data(){
   return {
     defaultActive: ''
   }
  },
  computed: {
    menu(){
      return menu.children
    },
    curRoute(){
      const { path } = this.$route
      return path.substring(5)
    }
  },
  methods: {
    selectMenu(key, keyPath) {
      const path = '/home'+key
      if(path !== this.$route.path){
        this.$router.push({
          path
        })
      }
    },
  },
  mounted(){
    this.defaultActive = this.$route.path.substring(5) || '/'
  }
}
</script>
<style scoped>
::v-deep{
  .el-submenu.is-opened{
    background: red;
  }
  .el-submenu:hover{
    color: #fff;
  }
}
</style>