<template>
  <div class="hll-upload-box">
    <div v-if="!hasFiles" class="empty">暂无文件</div>
    <div class="upload-loading" v-if="isLoading"><i class="el-icon-loading"></i></div>
    <el-upload
      v-bind="uploadAttrs"
      ref="elUpload"
      class="hll-upload"
      :data="uploadData"
      :file-list="fsList"
    >
      <div
        class="upload-footer-bottom-box"
        :title="uploadAttrs.drag ? '拖动到此处或点击上传': '点击上传'"
      >
        <i class="el-icon-upload"></i>
        <i style="color: red;" v-if="ifNecessary">*</i>
        <span>{{title}}</span>
      </div>
    </el-upload>
  </div>

</template>
<script>
import { delUploadFile } from '@/api/common';
import _ from 'lodash';
let acceptFiles = [
  '.JPG', '.PNG', '.JPEG', '.GIF',
  '.PDF', '.XLSX', '.XLS', '.DOC',
  '.ZIP'
]
let isAcceptFileReg = new RegExp(`(${acceptFiles.join('|')})$`, 'i')
export default {
  name: 'HllUpload',
  componentAlias: 'HllUpload',
  props: {
    data: {
      default(){ return {}}
    },
    ifNecessary: {},
    title: {},
    value: {},
    beforeBeforeRemove: [Function],
    beforeBeforeUpload: [Function],
  },
  data() {
    return {
      fsList: [],
      hasFiles: false,
      isLoading: false
    };
  },
  computed: {
    uploadAttrs(){
      return {
        name: 'multipartFiles',
        action: '/api/attachment/uploadfiles',
        drag: true,
        autoUpload: true,
        listType: 'text',
        multiple: true,
        // accept: acceptFiles.join(','),
        beforeUpload: this.beforeUpload,
        onRemove: this.handleRemove,
        beforeRemove: this.beforeRemove,
        onSuccess: this.handleAvatarSuccess,
        onChange: this.handleChange,
        onError: this.handleError,
        onPreview: this.handlePreview,
        ...this.$attrs,
      }
    },
    uploadData(){
      return {
        formId: '1000',
        ...this.data
      }
    }
  },
  watch: {
    value: {
      handler() {
        this.lastFileList = null
        this.resetFs()
        this.hasFiles = (this.value&&!!this.value.length)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 手动上传
    submit() {
      const find = this.$refs.elUpload.uploadFiles.find(item => item.status === 'ready')
      if(!!find){
        this.$refs.elUpload.submit();
      } else {
        this.$message.error('没有需要上传的文件');
      }
    },
    async beforeRemove(file) {
      if(!file.id) return true
      if(this.beforeBeforeRemove){
        const result = await this.beforeBeforeRemove(file)
        if(!result){
          return false
        }
      }
      // todo 这些判断应该放在组件处理
      if (this.noEdit && !this.delRole) {
        this.$message.error('非激活状态不可删除');
        return false
      }
      // 不是上传人又没有删除权限的情况下
      if (file.createBy != sessionStorage.userId && !this.delRole) {
        this.$message.error('您没有权限删除');
        return false
      }
      return this.$confirm(`确认删除附件(${file.name})？`)
    },
    async handleRemove(file, fileList) {
      if(file.id) {
        this.isLoading = true
        delUploadFile({ id: file.id })
          .then(res => {
            let result = { data: { file, fileList } }
            if (+res.code === 0) {
              this.$message.success('文件删除成功！');
              this.fsList = fileList
              this.saveLastFileList(fileList)
              this.$emit('input', this.getValidValue(fileList))
            } else {
              result.err = res.msg
              this.$message.error(res.msg);
              this.resetFs() // 删除失败还原最后的列表
            }
            this.$emit('removeResult', result)
          })
          .finally(() => {
            this.isLoading = false
          })
      }else{
        this.fsList = fileList
      }
      this.hasFiles = !!fileList.length
    },
    // 这一步不需要做还原操作
    async beforeUpload(file) {
      if(this.beforeBeforeUpload){
        const result = await this.beforeBeforeUpload(file)
        if(!result){
          return Promise.reject()
        }
      }
      // todo
      /*if (this.filterName) {
          const { recordId } = this.uploadParams
          if (recordId === 0 || recordId === '') {
            this.$message({ type: 'warning', message: this.filterName });
            return false;
          }
        }*/
      if(!isAcceptFileReg.test(file.name)){
        this.$message.error(`仅支持${acceptFiles.join()}格式`);
        return Promise.reject()
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
        return Promise.reject()
      }
      this.isLoading = true
      return Promise.resolve();
    },
    // 上传成功
    handleAvatarSuccess(res, file, fileList){
      let result = {}
      if (res.code === 0) {
        Object.assign(file, res.data[0])
        result = { data: {file, fileList } }
      } else {
        result = {
          data: {file, fileList },
          err: res.msg
        }
      }
      if(!this.submitResult) this.submitResult = []
      this.submitResult.push(result)
      if(!fileList.find(item => item.status === 'ready')){ // 表示都上传完毕
        this.isLoading = false
        const errInfo = []
        this.submitResult.forEach(item => {
          if(!!item.err){
            errInfo.push(item.data.file.name)
          }
        })
        this.fsList = _.cloneDeep(fileList.filter(item => {
          if(!item.row && item.url){
            return true
          }
          return item.status !== 'fail' && item.response && item.response.code === 0
        }))
        this.saveLastFileList(this.fsList)
        if(errInfo.length){
          this.$message.error(`以下文件上传失败：${errInfo}`);
        } else {
          this.$message.success('上传成功！');
        }
        this.$emit('uploadResult', [...this.submitResult]);
        this.$emit('input', [...this.fsList])
        this.submitResult = []
      }
    },
    /**
     * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
     * */
    handleChange (file, fileList) {
      this.saveLastFileList(fileList)
      this.hasFiles = !!fileList.length
    },
    // 保存最后的文件状态，用于还原使用
    saveLastFileList(fileList){
      this.lastFileList = _.cloneDeep(fileList)
    },
    handleError(err) {
      this.isLoading = false
      let errMsg = err.type ? err.type : err
      this.$message.error(errMsg);
      this.$emit('uploadResult', [{err: errMsg}]);
      this.fsList = _.cloneDeep(this.getValidValue()) //  上传失败还原最初的列表
    },
    getValidValue(fileList = this.value){
      // 在手动上传的情况下，双向绑定的值可能会存在未上传的文件
      // 需要过滤出真正存在文件
      let originFile = (fileList||[]).filter(item => (item && item.status !== 'ready'))
      return originFile
    },
    resetFs(){
      this.fsList = _.cloneDeep(this.lastFileList||this.getValidValue()||[])
    },
    // 查看文件
    handlePreview(file) {
      this.$PreviewFile({
        initialFile: file,
        list: this.fsList
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.hll-upload-box{
  position: relative;
  height: 130px;
  vertical-align: top;
  width: 175px;
  border-radius: 5px;
  box-shadow: 0 0 10px #ccc;
}
.hll-upload {
  background: #ddd;
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  ::v-deep{
    .el-icon-close-tip{
      display: none !important;
      opacity: 0;
    }
    .el-upload-list__item {
      transition: all 0s !important;
    }
    .el-upload-dragger{
      width: 100%;
      height: 40px;
      background: transparent;
    }
    .el-upload-list {
      flex: 1;
      background: #fff;
      overflow: auto;
      padding:0 10px;
    }
    .el-upload-list__item:first-child {
      margin-top: 5px;
    }
  }

  .upload-footer-bottom-box {
    height: 40px;
    width: 100%;
    padding-top: 5px;
    text-align: center;
    transition: all .1s;
    border-radius: 0;
    &:hover {
      span {
        color: #409eff;
      }
      i {
        color: #409eff;
      }
    }
    .el-icon-upload {
      font-size: 30px;
      color: #c0c4cc;
      line-height: 1;
      margin: 0;
      vertical-align: middle;
    }
    span{
      transition: all .1s;
      color: #2d2e2f;
      vertical-align: middle;
    }
    i{
      transition: all .1s;
    }
  }
}
.empty{
  position: absolute;
  height: 90px;
  width: 100%;
  z-index: 10;
  left: 0;
  top: 0;
  color: #cec9c9;
  padding-top: 20px;
  text-align: center;
  i{
    font-size: 60px;
  }
}
.upload-loading{
  position: absolute;
  height: 100%;
  background: rgba(255,255,255,0.8);
  width: 100%;
  z-index: 10;
  left: 0;
  top: 0;
  color: #cec9c9;
  padding-top: 20px;
  text-align: center;
  i{
    font-size: 60px;
  }
}
</style>
