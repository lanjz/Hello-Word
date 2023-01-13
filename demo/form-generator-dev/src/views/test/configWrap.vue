<template>
  <div>
    <div v-if="!configs.length" class="empty"> 暂无可配置内容 </div>
    <div v-else class="form-wrap">
      <CForm label-width="110px" :model="configForm" label-suffix="：" :column="configs">
        <div slot="action">
          <el-button size="small" class="has-icon" @click="reset">
            <span class="iconfont el-icon-refresh-right" style="margin-right: 4px"></span>重置
          </el-button>
        </div>
      </CForm>
    </div>
  </div>
</template>

<script>
import CForm from '../../components/cForm/indexJS'

const titleMap = {
  default: '基本配置',
  'el-form-item': 'formItem配置',
  slot: '插槽'
}
export default {
  name: 'setConfig',
  props: {
    activityEl: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    CForm
  },
  data(){
    return {
      configs: [],
      configForm: {}
    }
  },
  watch: {
    activityEl: {
      immediate: true,
      handler(val) {
        this.configForm = {}
        const defaultFormValue = {}
        const { __config__ = {} } = val
        let formConfig = []
        const keys = Object.keys(__config__)
        keys.forEach(i => {
          formConfig.push(
            {
              label: titleMap[i],
              prop: 'title',
              render: 'h2',
              class: 'form-group-title'
            }
          )
          const curConfig = __config__[i] || []
          formConfig = [...formConfig, ...curConfig]
          curConfig.forEach(item => {
            defaultFormValue[item.prop] = item.default
          })
        })
        if (val.slot) {
          Object.keys(val.slot).forEach(item => {
            const res = val.slot[item]
            formConfig.push({
              label: res.label,
              prop: item,
              default: item.show,
              render: 'el-switch'
            })
          })
        }
        this.configs = formConfig
        this.configForm = val.props || defaultFormValue
        this.defaultFormValueST = { ...defaultFormValue }
      }
    },
    configForm: {
      deep: true,
      handler(val) {
        this.$emit('updateValue', val)
      }
    }
  },
  methods: {
    reset(){
      this.configForm = { ...this.defaultFormValueST }
    }
  }
}
</script>

<style scoped lang="scss">
.empty{
  text-align: center;
  margin-top: 80px;
  color: #666;
}
.form-wrap{
  padding: 20px 10px;
}
</style>
<style lang="scss">
$-form-el-lh: 32px;
/*表单*/
.c-form{
  .el-select{
    width: 100%;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  &.validate{
    .el-form-item{
      margin-bottom: 20px;
    }
  }
  .el-form-item__content{
    line-height: $-form-el-lh;
  }
  .el-form-item__label{
    color: #666;
    letter-spacing: 0;
    line-height: $-form-el-lh;
    padding: 0px 11px 0 0;
  }
  .el-input__inner{
    height: $-form-el-lh;
    line-height: $-form-el-lh;
    border: 1px solid #DEE1E8;
    border-radius: 2px;
    padding: 0 11px;
    color: #303133;
  }
  .el-input__inner:hover, .el-select:hover .el-input__inner{
    border: solid 1px #409EFF;
  }
  .el-input__icon{
    line-height: $-form-el-lh;
  }
  .el-select .el-input .el-icon-arrow-up{
    color: #333;
    font-weight: 700;
    font-size: 12px;
  }
  .el-date-editor.el-input{
    width: 100%;
    .el-input__inner{
      padding-left: 30px;
    }
  }
  /*内联表单*/
  &.el-form--inline{
    .el-input{
      width: 200px;
      min-height: 32px;
      line-height: 32px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 200px;
      height: 32px;
      line-height: 32px;
    }
  }
  /*mini尺寸*/
  &[size=mini]{
    .el-form-item__label{
      font-size: 12px;
    }
    ::-webkit-input-placeholder { /* WebKit browsers */
      font-size: 12px;
    }
    .el-form-item--mini.el-form-item{
      margin-bottom: 8px;
    }
  }
}

</style>
