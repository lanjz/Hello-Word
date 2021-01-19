<template>
  <div class="data-overview">
    <div class="flex between m-t align-center title-bar">
      <div class="title">司机信息概览</div>
      <div>
        <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期">
        </el-date-picker>
        <el-tag style="margin-left: 20px"><i class="iconfont el-icon-refresh refresh-icon"></i></el-tag></div>
    </div>
    <div class="operation-title">车队概况</div>
    <div class="view-panel">
      <div class="view-box">
        <div>今日总流水</div>
        <div class="c-black"><b>0</b> <span>元</span>  </div>
        <div class="flex between m-t">
          <span>昨日</span>
          <span class="c-black">0元</span>
        </div>
        <div class="flex between m-t">
          <span>昨日</span>
          <span class="c-black">0元</span>
        </div>
      </div>
    </div>
    <div class="operation-title">司机概况</div>
    <div class="view-panel">
      <div class="view-box">
        <div>今日总流水</div>
        <div class="c-black"><b>0</b> <span>元</span>  </div>
        <div class="flex between m-t">
          <span>昨日</span>
          <span class="c-black">0元</span>
        </div>
        <div class="flex between m-t">
          <span>昨日</span>
          <span class="c-black">0元</span>
        </div>
      </div>
    </div>
    <div class="operation-title">司机异常</div>
    <div class="view-panel">
      <div class="view-box">
        <div>今日总流水</div>
        <div class="c-black"><b>0</b> <span>元</span>  </div>
        <div class="flex between m-t">
          <span>昨日</span>
          <span class="c-black">0元</span>
        </div>
        <div class="flex between m-t">
          <span>昨日</span>
          <span class="c-black">0元</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data(){
    return {
      ranking: [
        {name: 'name-1', res: 100},
        {name: 'name-1', res: 100},
        {name: 'name-1', res: 100},
        {name: 'name-1', res: 100},
        {name: 'name-1', res: 100},
      ],
      date: Date.now()
    }
  }
}
</script>

<style scoped lang="scss">
.data-overview{
  color: #7d7b7b;
}
.c-black{
  color: #333;
}
.view-box{
  width: 300px;
  background: #fff;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  b{
    font-size: 40px;
  }
  .m-t{
    margin-top: 5px;
  }
}
.refresh-icon{
  font-size: 18px;
  color: #f56c6c;
}
.title-bar{
  background: #fff;
  padding: 10px 15px;
  font-size: 14px;
  .title{
    font-size: 22px;
    font-weight: bold;
    color: #333;
  }
}
.view-panel{
  margin: 10px 0;
  margin-bottom: 30px;
}
.operation-title{
  margin-top: 20px;
  font-size: 16px;
  border-left: solid 4px #ff5103;
  padding-left: 10px;
}
</style>