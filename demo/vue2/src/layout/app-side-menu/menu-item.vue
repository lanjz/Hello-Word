<template>
<div>
  <el-submenu
      v-if="item.children&&item.children.length"
      :index="pathKey(item)"
      popper-append-to-body
      class="app-menu-item"
  >
    <template slot="title">
      <i class='el-icon-umbrella'></i>
      <span slot="title" class="name-label">{{item.label}}</span>
    </template>
    <menu-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :basePath="pathKey(item)"
    />
  </el-submenu>
  <el-menu-item v-else :index="pathKey(item)">
    <span slot='title' class="name-label" >{{item.label}}</span>
  </el-menu-item>
</div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    },
  },
  methods: {
    pathKey(item){
      return item.path
    }
  },
  data() {
    return {
    }
  },
}
</script>
<style lang="scss">
$--color-primary: #86ba76;
.app-nav{
  // 右侧 icon 位置
  .el-submenu__icon-arrow{
    right: 10px;
    font-size: 13px;
    width: 16px;
    height: 14px;
    font-weight: bold;
  }
  .el-submenu [class^=el-icon-]{
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
  .el-menu-item, .el-submenu__title{
    height: 40px;
    line-height: 40px;
    margin-top: 4px;
    border-radius: 4px;
    min-width: 100%;
    color: #666;
  }
  // 标题
  .menu-title-wrap{
    display: flex;
    align-items: center;
    i{
      width: 16px;
      height: 16px;
      font-size: 17px;
    }
  }
  //悬停时的颜色
  .el-submenu__title:hover, .el-menu-item:not(.is-active):hover{
    background-color: #fff !important;
    color: $--color-primary !important;
    i{
      color: $--color-primary !important;
    }
    .sub-item-title:before{
      background: $--color-primary;
    }
  }
  // 标题样式
  .sub-item-title{
    display: flex;
    align-items: center;
    &:before{
      content: '';
      display: inline-block;
      background: #666;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  //已展开的菜单颜色
  .is-opened{
    &>.el-submenu__title{
      color: $--color-primary;
      text-shadow: 0 0 0.25px currentcolor;
      i{
        color: $--color-primary;
      }
    }
  }
  /*选中时的颜色*/
  .el-menu-item.is-active{
    color: #fff;
    position: relative;
    background-color: $--color-primary !important;
    .sub-item-title:before{
      background: #fff;
    }
  }
}

</style>