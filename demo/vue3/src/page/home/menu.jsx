<template>
  <el-menu
      style="border-right: none"
      :uniqueOpened="true"
      :default-active="defaultActive"
      background-color="#001529"
      text-color="#c0c4cc"
      active-text-color="#fff"
      @select="selectMenu"
  >
    <template v-for="(item, index) in menu" :key="index">
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
    selectMenu(key) {
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
<style scoped lang="scss">
::v-deep{
  .el-submenu.is-opened{
    background: #ff5103;
  }
  .el-submenu:hover{
    color: #fff;
  }
  .el-menu-item:hover, .el-menu-item:focus {
    outline: none;
    background-color: #ff5103;
  }
}
</style>