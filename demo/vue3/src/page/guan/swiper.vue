<template>
  <div class="swiper-container">
    <div style="font-size: 18px;margin-bottom: 56px">专业高效，提升企业效益</div>
    <div class="swiper" style="width: 804px">
      <div class="swiper-menu">
        <div
            class="swiper-menu-item"
            @mouseover="index=0"
            :class="{'act': index===0}"
        >
          <span>成本节省</span>
          <b>32%</b>
        </div>
        <div
            class="swiper-menu-item"
            @mouseover="index=1"
            :class="{'act': index===1}"
        >
          <span>货运效率提高</span>
          <b>1倍</b>
        </div>
        <div
            class="swiper-menu-item"
            @mouseover="index=2"
            :class="{'act': index===2}"
        >
          <span>减少货运风险</span>
          <b>72%</b>
        </div>
      </div>
      <div
          class="swiper-scroll"
          :style="{width: 3*804+'px', transform: 'translateX(-'+index*804+'px)' }"
      >
        <div class="swiper-item" style="width: 804px">
          <div>
            <Circle :percent="33" text="技术成本节省"></Circle>
            <div class="person-text">
              API技术支持<br>专业用车系统接入<br>1天快速交接
            </div>
          </div>
          <div>
            <Circle :percent="35" text="运输成本节省"></Circle>
            <div class="person-text">
              秒比价，定价透明<br>实时监控每笔费用明细<br>比自养车、租车节省35%以上成本
            </div>
          </div>
          <div>
            <Circle :percent="28" text="人力成本节省"></Circle>
            <div class="person-text">
              当日即开电子普票<br>
              月结、充值等支付模式，<br>
              无需繁琐报销
            </div>
          </div>
        </div>
        <div class="swiper-item" style="width: 804px">
          <div>
            <Circle :percent="98" :startAngle="270"></Circle>
            <div class="person-text">
              98%匹配率<br>24+种车型选择
            </div>
          </div>
          <div>
            <Circle :percent="95" :startAngle="270"></Circle>
            <div class="person-text">
              95%准点率<br>三证考核的专业司机<br>规范操作，路线熟悉
            </div>
          </div>
          <div>
            <Circle :percent="100" :startAngle="270 "></Circle>
            <div class="person-text">
              100%跟踪<br>
              专属客服服务，实时监控路线
            </div>
          </div>
        </div>
        <div class="swiper-item" style="width: 804px">
          <div>
            <img src="./image/swiper-2-1.png" width="122">
            <div class="person-text">
              24小时响应<br>30万+月活司机，及时用车
            </div>
          </div>
          <div>
            <img src="./image/swiper-2-2.png" width="122">
            <div class="person-text">
              100%货物保障<br>最高200万元货物保额
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import Circle from './circle'
export default {
  data(){
    return {
      index: 0,
    }
  },
  components: {
    Circle
  },
}
</script>
<style>

.swiper-container{
  height: 542px;
  text-align: center;
  background: url("./image/bg_3.png") no-repeat scroll 0 0 / 100% 100%;
  color: #fff;
  font-weight: 400;
  padding-top: 58px;
}
.swiper-scroll{
  display: flex;
  transition: .5s;
}
.swiper{
  width: 804px;
  overflow: hidden;
  margin: 0 auto;
}
.swiper-item{
  display: flex;
  text-align: center;
}
.swiper-item>div{
  width: 33.33%;
}
.person-text{
  font-size: 12px;
  line-height: 18px;
  margin-top: 23px;
}
.swiper-menu{
  display: flex;
  justify-content: space-between;
  margin-bottom: 56px;
}
.swiper-menu .swiper-menu-item{
  width: 33.2%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 12px;
  background: rgba(0,0,0,.2);
  position: relative;
}
.swiper-menu .swiper-menu-item b{
  font-size: 24px;
  font-weight: 600;
  color: #F16322;
  margin-top: 2px;
}
.swiper-menu-item:after{
  content: '';
  width: 100%;
  height: 2px;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #F16322;
  opacity: 0;
  transition: .3s;
}
.swiper-menu-item:before{
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-bottom: solid 8px #F16322;
  border-left: solid 8px transparent;
  border-right: solid 8px transparent;
  opacity: 0;
  transition: .3s;
}
.swiper-menu-item.act{
  background: rgba(241, 99, 34, 0.35);
}
.swiper-menu-item.act:after{
  opacity: 1;
}
.swiper-menu-item.act:before{
  opacity: 1;
}
</style>