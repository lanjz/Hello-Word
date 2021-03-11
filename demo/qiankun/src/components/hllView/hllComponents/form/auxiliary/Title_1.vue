<template>
<div class="item-title">
  <div>{{formItemData.title}}</div>
  <div class="line"></div>
</div>
</template>

<script>
export default {
  name: "itemTitle",
  props: ['formItemData']
}
</script>

<style scoped>
.item-title{
  font-size: 14px;
  color: #f16622;
}
.line{
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #ddd;
  margin-bottom: 22px;
  margin-top: 10px;
}
</style>
