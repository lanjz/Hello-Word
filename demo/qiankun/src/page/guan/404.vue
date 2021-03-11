<template>
  <div class="container">
    <Header></Header>
    <div class="title">公司简介</div>
    <div class="content-1">
      <img src="./image/1-1.png" style="width: 138px" alt="">
      <div class="text">
        广州吉吉货运有限公司于2018年09月29日成立。公司经营范围包括：打包、装卸、运输全套服务代理;装卸搬运;道路货物运输代理;仓储代理服务;物流代理服务;货物进出口（专营专控商品除外）;贸易代理;贸易咨询服务;汽车销售;汽车零配件零售;车辆工程的技术研究、开发;广告业;仓储咨询服务;商品信息咨询服务;二手车销售;汽车租赁;道路货物运输;普通货物运输（搬家运输服务）;货物专用运输（集装箱）等。
      </div>
    </div>
    <div class="title">解决方案</div>
    <Swiper></Swiper>
    <div class="title">精准分析，解决各行货运难题</div>
    <div class="content-3">
      <div class="content-3-item" v-for="(item,ind) in list" :key="ind">
        <img :src="item.url" alt="">
        <div class="img-text">
          <div class="text-1">{{item.text1}}</div>
          <div class="text-2">{{item.text2}}</div>
        </div>
        <div class="des">{{item.des}}</div>
      </div>
    </div>
    <div class="foot">
      <img src="./image/logo.png" />
      <span>广州吉吉货运有限公司</span>
      <span style="margin: 0 19px">|</span>
      <span> 粤ICP备2021006833号</span>
    </div>
  </div>
</template>
<script>
import Swiper from './swiper'
import Header from './Header'
import C_1 from './image/3-1.png'
import C_2 from './image/3-2.png'
import C_3 from './image/3-3.png'
import C_4 from './image/3-4.png'
import C_5 from './image/3-5.png'
import C_6 from './image/3-6.png'
export default {
  props: {
    angle: {
      default(){
        return 240
      }
    }
  },
  data(){
    return {
      list: [
        {
          text1: '子母公司用车管控', text2: '解决方案', url: C_1,
          des: '“全国60多地仓库需要用车，各地员工用车明细难追踪，报销繁琐，费用不透明”'
        },
        {
          text1: '多车型匹配', text2: '解决方案', url: C_2,
          des: '“全国60多地仓库需要用车，各地员工用车明细难追踪，报销繁琐，费用不透明”'
        },
        {
          text1: '货运成本过高', text2: '解决方案', url: C_3,
          des: '“全国60多地仓库需要用车，各地员工用车明细难追踪，报销繁琐，费用不透明”'
        }
        ,
        {
          text1: '紧急运货', text2: '解决方案', url: C_4,
          des: '“全国60多地仓库需要用车，各地员工用车明细难追踪，报销繁琐，费用不透明”'
        },
        {
          text1: '物流配送分散', text2: '解决方案', url: C_5,
          des: '“全国60多地仓库需要用车，各地员工用车明细难追踪，报销繁琐，费用不透明”'
        },
        {
          text1: '多门店配送', text2: '解决方案', url: C_6,
          des: '“全国60多地仓库需要用车，各地员工用车明细难追踪，报销繁琐，费用不透明”'
        },
      ]
    }
  },
  components: {
    Swiper,
    Header,
  },
  mounted() {

  }
}
</script>
<style>
.container{
  text-align: center;
}
.title{
  font-size: 30px;
  font-weight: 600;
  color: #2F3439;
  line-height: 46px;
  padding-bottom: 17px;
  position: relative;
  margin-bottom: 38px;
  margin-top: 94px;
}
.title:after{
  content: '';
  position: absolute;
  display: inline-block;
  width: 85px;
  height: 2px;
  background: #F16622;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
/*------content-1-------*/
.content-1 .text{
  vertical-align: top;
  width: 364px;
  font-size: 12px;
  font-weight: 400;
  color: #768191;
  line-height: 18px;
  display: inline-block;
  margin-left: 20px;

}
/*------content-3-------*/
.content-3-item{
  width: 150px;
  height: 305px;
  background: #fff;
  text-align: left;
  position: relative;
  color: #fff;
  display: inline-block;
}
.content-3-item .img-text{
  position: absolute;
  top: 0;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  line-height: 18px;
  width: 100%;
}
.img-text .text-1{
  font-size: 14px;
  font-weight: 400;
}
.img-text .text-2{
  font-size: 12px;
  font-weight: 400;
  color: #FFFFFF;
  margin-top: 4px;
}
.content-3-item img{
  width: 100%;
  height: 200px;
  vertical-align: bottom;
}
.content-3-item .des{
  font-size: 12px;
  font-weight: 400;
  color: #2F3439;
  line-height: 18px;
  padding: 10px 15px;
  color: #2F3439;
}
/*---foot----*/
.foot{
  height: 76px;
  background: #434457;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 46px;
}
.foot img{
  width: 37px;
  margin-right: 10px;
}
</style>