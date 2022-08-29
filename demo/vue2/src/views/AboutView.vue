<template>
  <div class="about">
    <div class="c1 target" v-for="item in 7" :class="'c'+item" :key="item" v-exp-dot :data-des="'c'+item">
      {{'c'+item}}
    </div>
  </div>
</template>
<style>
.target{
  display: inline-block;
  width: 200px;
  height: 40px;
  border: solid 1px red;
  position: absolute;
}
.c8{
  top: 1500px;
}
.c7{
  top: 1700px;
}
.c6{
  top: 1000px;
}
.c5{
  left: 500px;
}
.c4{
  left: 1000px;
}
.c3{
  left: 1500px;
}
.c2{
  top: 200px;
}
.red{
  background: red;
}
</style>