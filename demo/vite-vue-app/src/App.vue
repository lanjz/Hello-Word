<template>
  <div>
    <div style="height: 50px"></div>
    <VirtualScroll :data="listSource" :height="500" :render="virtualItem"></VirtualScroll>
  </div>

</template>

<script>
  import VirtualScroll from './virtualScroll.vue'
  import virtualItem from './virtualItem.vue'

  let listNumber = 5000
  let listSource = [] // 数据模拟
  for (let i = 0; i < listNumber; i++) {
    listSource.push({
      label: 'label：' + i,
      id: i,
      name: 'Name:' + i,
      content: 'contentcontentcontentcontentcontentcontentcontent'
    })
  }
  export default {
    data() {
      return {
        listSource,
        virtualItem
      }
    },
    components: {
      VirtualScroll
    },
    methods: {}
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  * {
    box-sizing: border-box;
  }

  .item {
    height: 150px;
    border: solid 1px red
  }
</style>
