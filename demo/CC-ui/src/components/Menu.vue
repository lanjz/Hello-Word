<template>
  <div class="menu-title">组件列表</div>
  <div class="menu">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="{
        group: item.isGroup,
        item: !item.isGroup,
        act: `/wc/${String(item.name)}` === route.path,
      }"
      @click="handle(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { wcRoutes, RouterConfig } from '../router/index'
import { useRoute, useRouter } from 'vue-router'

export type MenuConfig = RouterConfig & {
  isGroup?: boolean
}
const router = useRouter()
const route = useRoute()
const list: MenuConfig[] = []
let lastGroup: string = ''
wcRoutes.forEach((item) => {
  if (lastGroup !== item.group) {
    lastGroup = item.group
    list.push({
      ...item,
      isGroup: true,
      label: item.group,
    })
  }
  list.push(item)
})
const handle = (item: MenuConfig) => {
  if (item.isGroup) return
  router.push({
    path: item.path,
  })
}
</script>
<style lang="scss" scoped>
.menu-title {
  font-weight: bold;
  padding: 15px 10px;
}
.menu {
  display: inline-block;
  padding: 0 10px;
  color: #3f536e;
  z-index: 99;
  height: 100%;
  overflow: auto;
  width: 100%;
  .item,
  .group {
    padding-left: 10px;
    position: relative;
  }
  .group {
    color: #bdb8b8;
    margin-top: 20px;
    height: auto;
    line-height: unset;
    font-size: 13px;
    margin-bottom: 10px;
  }
  .item {
    height: 25px;
    line-height: 25px;
    margin-bottom: 10px;
    &:not(.group) {
      cursor: pointer;
    }
    &:not(.group):hover {
      color: $color-primary;
    }
    &.act {
      color: $color-primary;
      &:after {
        content: '';
        width: 2px;
        background: $color-primary;
        position: absolute;
        left: 0;
        top: 50%;
        height: 15px;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
