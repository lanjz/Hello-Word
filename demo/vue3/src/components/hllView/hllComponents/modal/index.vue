<template>
<div>
  <el-button @click="dialogVisible=true">显示弹层</el-button>
  <HllModal
      v-model="dialogVisible"
      autoClose
      @action="dialogAction"
      title="dialogVisible"
  >
    <IndexList></IndexList>
  </HllModal>
</div>
</template>

<script>
export default {
  name: "index",
  data(){
    return {
      dialogVisible: false
    }
  },
  methods: {
    dialogAction(type){
      console.log('type', type)

    }
  }
}
</script>

<style scoped>

</style>