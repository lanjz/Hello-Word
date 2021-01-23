<template>
  <div class="circle-box">
    <div class="container">
      <div>
        <span class="text" v-if="text">{{text}}</span>
        <span class="angle" style="padding-bottom: 7px">{{percent}}%</span>
      </div>
    </div>
    <canvas height="122" width="122" ref="myCanvas"></canvas>
  </div>
</template>
<script>
export default {
  props: {
    text: {},
    des: {},
    percent: {
      default(){
        return 0
      }
    },
    startAngle: {
      default() {
        return 25;
      }
    }
  },
  data(){
    let rotate_1, rotate_2
    let angle = (this.percent/100)*360
    if(angle > 180){
      rotate_1 = 180
      rotate_2 = angle-180
    } else {
      rotate_1 = angle
    }
    return {
      angle,
      rotate_1,
      rotate_2,
    }
  },
  methods: {
    getAngle(ang){
      return 2*(ang/360)
    }
  },
  mounted() {
    let c=this.$refs.myCanvas
    let ctx=c.getContext("2d");
    let startAngle = this.getAngle(this.startAngle)
    let endAngle = this.getAngle(this.startAngle+this.angle)
    let center = c.width/2
    let radius = center-5
    ctx.beginPath();
    ctx.lineWidth=10;
    ctx.strokeStyle="rgba(0,0,0,0.4)";
    ctx.arc(center,center,radius,0*Math.PI,360*Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle="#F16322";
    ctx.arc(center,center,radius,startAngle*Math.PI,endAngle*Math.PI, false);
    ctx.stroke();
  }
}
</script>
<style>
.circle-box {
  display: inline-block;
  text-align: center;
  position: relative;
}
.circle-box .container{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.circle-box .text{
  font-size: 12px;
  font-weight: 400;
  color: #FFFFFF;
}
.circle-box .angle{
  font-size: 29px;
  font-weight: 500;
  color: #F16322;
  margin-top: 2px;
}

</style>