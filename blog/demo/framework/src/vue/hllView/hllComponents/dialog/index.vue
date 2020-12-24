<template>
<div>
  <el-button @click="dialogVisible=true">显示弹层</el-button>
  <HllDialog
      v-model="dialogVisible"
      autoClose
      @action="dialogAction"
      title="dialogVisible"
  >
    <IndexListPage></IndexListPage>
  </HllDialog>
</div>
</template>

<script>
import IndexListPage from "../../components/indexList/index";
export default {
  name: "index",
  data(){
    return {
      dialogVisible: false
    }
  },
  components: { IndexListPage },
  methods: {
    dialogAction(type){
      console.log('type', type)

    }
  }
}
</script>

<style scoped>

</style>