<template>
  <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px">
    <c-form
        label-width="70px"
        class="search-form"
        :model="editForm"
        :column="editFormConfig"
        :loading="isLoading"
        ref="editFormRef"
        hide-action
    />
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import emitter from '@/utils/emitter';

export default {
  name: 'd-dialog-form',
  componentName: 'd-dialog-form',
  mixins: [emitter],
  props: {
    editFormConfig: {
      type: Array,
      default: () => ([])
    }
  },
  data(){
    return {
      editForm: {},
      isLoading: false,
      dialogVisible: false,
    }
  },
  methods: {
    getDefaultProperty(data) {
      let res = {};
      data.forEach((item) => {
        res[item.prop] = '';
      });
      return res;
    },
    open() {
      this.dialogVisible = true
      this.initSearchForm()
    },
    onSearch(){
      this.EventBusST.$emit('d-table-event', 'onSearch')
    },
    submitForm() {
      this.$refs['editFormRef'].validate(async (valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.$message({
            message: this.editForm.id ? '修改成功' : '新增成功',
            type: 'success',
          });
          this.onSearch();
        }
      });
    },
    initSearchForm(){
      this.editForm = { ...this.getDefaultProperty(this.editFormConfig) }
    }
  },
}
</script>

<style scoped>

</style>