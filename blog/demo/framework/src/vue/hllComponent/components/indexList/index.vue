<template>
  <div>
    <div style="height: 500px">
      <IndexList :indexList="indexList" defaultActivity="用户管理">
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
      </IndexList>
    </div>
  </div>

</template>

<script>
import IndexList from './IndexList'
import IndexListContent from './IndexListContent'
import IndexAnchor from './IndexAnchor'
export default {
  data() {
    return {
      indexList: [
        {key: '用户管理', label: '用户管理'},
        {key: '配置管理', label: '配置管理'},
        {key: '角色管理', label: '角色管理'},
        {key: '定时任务补偿', label: '定时任务补偿'}]
    }
  },
  components: {
    IndexList,
    IndexAnchor,
    IndexListContent
  },
}
</script>
<style scoped>
.content{
  height: 500px;

}
</style>