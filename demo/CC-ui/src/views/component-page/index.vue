<template>
  <div id="appMain">
    <div class="app-main-left">
      <Menu></Menu>
    </div>
    <div class="app-main-right">
      <my-element></my-element>
      <router-view />
    </div>
  </div>
</template>
<script setup lang="ts">
import Menu from '../../components/Menu.vue'
</script>

<style lang="scss" scoped>
.app-main-left {
  width: 150px;
  margin-top: $head-height;
  border-right: solid 1px #eee;
  height: 100%;
  flex-shrink: 0;
  position: fixed;
  top: 2px;
  bottom: 0;
  z-index: 2;
}
.app-main-right {
  width: 100%;
  position: relative;
  padding-left: 150px;
  padding-top: 20px;
}
</style>
