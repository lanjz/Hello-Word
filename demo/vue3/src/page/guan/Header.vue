<template>
<div class="header">
  <div class="content">
    <img src="./image/logo.png" alt="" class="logo">
    <span>广州吉吉货运有限公司</span>
    <div class="menu">
      <div class="menu-item">
        首页
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
name: "Header"
}
</script>

<style scoped>
.header{
  height: 68px;
  font-size: 14px;
  color: #fff;
  background: #434457;
}
.content{
  width: 910px;
  margin: 0 auto;
  text-align: left;
  display: flex;
  align-items: center;
}
.logo{
  width: 55px;
  margin-right: 20px;
}
.menu{
  margin-left: 100px;
}
.menu-item{
  height: 100%;
  display: inline-block;
  position: relative;
  min-width: 54px;
  text-align: center;
  line-height: 67px;
  cursor: pointer;
}
.menu-item:after{
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 54px;
  height: 2px;
  background: #F16622;
  border-radius: 1px;

}
</style>