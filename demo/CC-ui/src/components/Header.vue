<template>
  <div class="header">
    <fin-flex
      justify-content="space-between"
      align-items="center"
      width="1150px"
      height="100%"
      style="margin: 0 auto"
    >
      <fin-img :src="LogoImg" width="54px" fit="contain"></fin-img>
      <div class="head-menu">
        <div
          v-for="item in navs"
          :key="item.path"
          class="nav-item"
          :class="{ act: route.path.indexOf(item.path) === 0 }"
          @click="handle(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </fin-flex>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { mainRouter } from '../router/index'
import Logo from './Logo.vue'
import LogoImg from '../assets/img/logo.png'

const navs = mainRouter
const router = useRouter()
const route = useRoute()
const handle = (item) => {
  router.push({
    path: item.path,
  })
}
</script>
<style scoped lang="scss">
.header {
  position: sticky;
  background: #fff;
  //position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: $head-height;
  min-width: 500px;
  display: flex;
  justify-content: space-between;
  color: #213547;
  border-bottom: solid 1px rgba(60, 60, 60, 0.12);
  font-size: 16px;
  .in-head {
    width: 1150px;
    margin: 0 auto;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .head-menu {
    .nav-item {
      display: inline-block;
      cursor: pointer;
      padding: 6px 0;
      border-bottom: solid 2px transparent;
      &:hover {
        color: $color-primary;
      }
      &.act {
        border-bottom: solid 2px $color-primary;
      }
    }
    .nav-item:not(:last-child) {
      margin-right: 30px;
    }
  }

  .list {
    height: 80px;
    display: inline-flex;
    padding-right: 30px;
    .list-son {
      font-size: 18px;
      color: $color-white;
      padding: 0 30px;
      cursor: pointer;
      &:hover {
        background: lighten($color-primary, 30%);
      }
    }
  }
}
</style>
