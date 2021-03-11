<template>
  <div class="data-overview">
    <div class="flex between m-t align-center title-bar">
      <div class="title">实时数据</div>
      <div>数据更新时间：{{new Date()}} <el-tag> <i class="iconfont el-icon-refresh refresh-icon"></i></el-tag></div>
    </div>
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
    <div class="flex between m-t align-center title-bar">
      <div class="title">昨日数据</div>
      <div>数据更新时间：{{new Date()}}</div>
    </div>
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
    <div class="flex between m-t align-center title-bar">
      <div class="title">排行版</div>
      <div>数据更新时间：{{new Date()}}</div>
    </div>
    <div class="view-panel flex">
      <div class="rank-panel">
        <div v-for="(item, index) in ranking" :key="index" class="rank-item flex between">
          <div>
            <span class="index" :class="'index-'+index">{{index}}</span>
            <span>{{item.name}}</span>
          </div>
          <div class="c-black">
            {{item.res}}
          </div>
        </div>
      </div>
      <div class="rank-panel">
        <div v-for="(item, index) in ranking" :key="index" class="rank-item flex between">
          <div>
            <span class="index" :class="'index-'+index">{{index}}</span>
            <span>{{item.name}}</span>
          </div>
          <div class="c-black">
            {{item.res}}
          </div>
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
      ]
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
.rank-panel{
  background: #fff;
  padding: 10px 15px;
  width: 500px;
  margin-right: 30px;
  .rank-item{
    padding:10px 0;
    .index{
      display: inline-block;
      text-align: center;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 50%;
      font-size: 13px;
      margin-right: 20px;
      background: #f4f4f5;
      color: #909399;
    }
    .index.index-0{
      background: #ecf5ff;
      color: #409eff;
    }
    .index.index-1{
      background: #f0f9eb;
      color: #67c23a;
    }
    .index.index-2{
      background: #faecd8;
      color: #e6a23c;
    }
  }
}
</style>