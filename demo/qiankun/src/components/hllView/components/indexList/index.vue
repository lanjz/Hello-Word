<template>
  <div class="scroll-style" style="height: 500px">
    <IndexList :indexList="indexList" defaultActivity="用户管理" @change="change">
      <IndexListContent index="用户管理">
        <IndexAnchor>
          <div>用户管理</div>
        </IndexAnchor>
        <div class="content"></div>
      </IndexListContent>
      <IndexListContent index="配置管理">
        <IndexAnchor>
          <div>配置管理</div>
        </IndexAnchor>
        <div class="content"></div>
      </IndexListContent>
      <IndexListContent index="角色管理">
        <IndexAnchor>
          <div>角色管理</div>
        </IndexAnchor>
        <div class="content"></div>
      </IndexListContent>
      <IndexListContent index="定时任务补偿">
        <IndexAnchor>
          <div>定时任务补偿</div>
        </IndexAnchor>
        <div class="content" style="height: 100px"></div>
      </IndexListContent>
      <IndexListContent index="定时任务补偿2">
        <IndexAnchor>
          <div>定时任务补偿</div>
        </IndexAnchor>
        <div class="content2" style="height: 100px"></div>
      </IndexListContent>
    </IndexList>
  </div>
</template>

<script>
export default {
  data() {
    return {
      indexList: [
        {key: '用户管理', label: '用户管理'},
        {key: '配置管理', label: '配置管理'},
        {key: '角色管理', label: '角色管理'},
        {key: '定时任务补偿', label: '定时任务补偿'},
        {key: '定时任务补偿2', label: '定时任务补偿2'},
        ]
    }
  },
  methods: {
    change(e){
      console.log('change', e)
    }
  }
}
</script>
<style scoped>
.scroll-style{
  ::-webkit-scrollbar{ // 滚动条整体部分,必须要设置
    width: 4px;
    height: 8px;
    background-color: transparent;
  }
  ::-webkit-scrollbar-track{ // 滚动条的轨道
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb{ // 滚动条的滑块按钮
    border-radius: 2px;
    background-color: #aaa;
    box-shadow: inset 0 0 2px #aaa;
  }
  ::-webkit-scrollbar-button{ // 滚动条的上下两端的按钮
    height: 0;
    background-color: transparent;
  }

}
.content{
  height: 500px;

}
</style>