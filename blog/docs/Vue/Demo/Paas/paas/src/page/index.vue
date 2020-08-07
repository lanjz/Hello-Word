<template>
  <div>
    <h1>这是Page页面</h1>
    <div>这是接收到元数据信息：</div>
    <div>{{meta}}</div>
  </div>
</template>
<script>
  export default {
    name: 'PageIndex',
    props: ['meta'],
    data() {
      return {
      }
    },
    components: {
      // 'Page': Page
    },
  }
</script>
