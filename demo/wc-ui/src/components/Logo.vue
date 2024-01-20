<template>
  <div class="logo">
    <img src="../assets/img/logo.png" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.logo {
  height: 100%;
  display: inline-flex;
  align-items: center;
  position: relative;
  & > div {
    font-size: 35px;
    margin-left: 20px;
    color: $color-primary;
  }
  & > img {
    height: 100%;
    //position: absolute;
    //left: 0;
    //top: 0;
    //transform: translateX(-100%);
  }
}
</style>
