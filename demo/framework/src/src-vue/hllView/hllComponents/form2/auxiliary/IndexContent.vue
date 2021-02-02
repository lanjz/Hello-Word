<template>
  <IndexListContent
      :index="formItemData.index"
      :label="formItemData.text"
  >
    {{formItemData.text}}
  </IndexListContent>
</template>

<script>
import IndexListContent from "../../../components/indexList/IndexListContent";
export default {
  name: "itemTitle",
  props: ['formItemData'],
  components: {
    IndexListContent
  }
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
