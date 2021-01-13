<template>
  <div class="head flex">
    <div class="flex-1 flex align-center" style="color: #606266; minWidth: 167px">
      <div class="shrink" key="index">
        <el-dropdown trigger="click">
          <el-tag type="warning">
            <div class="flex align-center">
              <i class="el-icon-truck" style="font-size: 18px;margin-right: 5px"></i>
              当前车队
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
          </el-tag>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="el-icon-user">车队一</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
  </div>
  <div class="flex align-center">
    <img src="https://i.gtimg.cn/club/item/face/img/8/15918_100.gif" alt="" class="user-avatar"/>
    <div class="flex align-center">
      <el-dropdown trigger="click">
      <span class="el-dropdown-link name">
        {{userinfo.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-user">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('userinfo', ['userinfo']),
  }
}
</script>
<style scoped lang="scss">
.head{
  height: 100%;
  padding: 0 20px;
  .user-avatar{
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
  }
  .name{
    margin-left: 10px;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>