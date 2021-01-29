<template>
<div class="fold fold-flex" :class="type" ref="fold">
  <div class="fold-flex-1 fold-flex">
    <div class="fold-flex-1" :style="{'maxHeight': maxHeight}" :class="{'hide': !disable&&hide}">
      <div ref="fold-content">
        <slot></slot>
      </div>
    </div>
    <div class="fold-toggle" v-if="!disable&&isOverflow" :style="{'height': cssHeight}" >
      <span v-if="hide" @click="hide=false">更多选项</span>
      <span v-else @click="hide=true">收起</span>
    </div>
  </div>
  <div class="fold-action" v-if="!hideAction">
    <slot name="action">
      <el-button type="primary" icon="el-icon-search" @click="submit">查询</el-button>
      <el-button icon="el-icon-refresh" @click="clear">重置</el-button>
    </slot>
  </div>
</div>
</template>

<script>
export default {
  name: "Fold",
  props: ['height', 'type', 'hideAction', 'disable'],
  data(){
    return {
      cssHeight: (/\d$/).test(this.height)? this.height + 'px' : this.height,
      hide: true,
      isOverflow: false,
      hideHeight: this.height
    }
  },
  computed: {
    maxHeight(){
      return this.disable||!this.hide ? 'none' : this.cssHeight
    }
  },
  methods: {
    update(){
      if(this.$refs['fold-content'].clientHeight > parseInt(this.hideHeight)){
        this.isOverflow = true
      } else {
        this.isOverflow = false
      }
    },
    clear(){
      this.$emit('clear')
    },
    submit(){
      this.$emit('submit')
    }
  },
  mounted(){
    this.update()
    window.removeEventListener('resize', this.update)
    window.addEventListener('resize', this.update)
    if(!this.height && this.type === 'searchPanel'){
      const el = this.$refs['fold'].getElementsByClassName('el-form-item')[0]
      if(el){
        const { clientHeight } = this.$refs['fold'].getElementsByClassName('el-form-item')[0]
        this.cssHeight = this.hideHeight = clientHeight+'px'
        this.update()
      }

    }
  },
  destroyed(){
    window.removeEventListener('resize', this.update)
  }
}
</script>

<style scoped lang="scss">
.fold-flex{
  display: flex;
}
.fold-flex-1{
  flex: 1;
}
.fold{
  .hide{
    overflow: hidden;
  }
}
input{
  width: 200px;
  margin: 10px;
}
.fold-toggle{
  display: flex;
  align-items: center;
  padding: 0 7px;
  span{
    word-break: break-all;
    display: inline-block;
    color: #f16622;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 60px;
    text-align: center;
  }
}
.fold-action{
  //align-items: center;
}
::v-deep{
  .el-button.el-button--default {
    background: #dcdfe6;
  }
}
</style>

<style lang="scss" scoped>
.searchPanel{
  ::v-deep{

  }
}

</style>
