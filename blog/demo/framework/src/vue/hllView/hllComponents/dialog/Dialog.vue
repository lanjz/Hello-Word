<template>
  <transition name="dialog-fade">
    <div
        v-show="dialogVisible"
        class="dialog-wrap"
        :style="[
      {'left': collapse ? '64px' : '240px'},
      {'width': collapse ? 'calc(100vw - 64px)' : 'calc(100vw - 240px)'}
    ]">
      <div class="dialog-content" :style="[{'width': `${width||700}px`}]">
        <header class="dialog-header">
          <h1>
            {{title}}
            <i v-if="smallTitle" class="hll-small-small-title">{{smallTitle}}</i>
          </h1>
          <div class="dialog-close">
            <button type="button" class="el-dialog__headerbtn" @click="close">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
        </header>
        <section class="dialog-main">
          <slot></slot>
        </section>
        <footer class="dialog-submit" v-if="footBtnList.length">
          <el-button
              v-for="(item, index) in footBtnList"
              :key="index"
              :type="item.type"
              @click="handleAction(item)"
          >{{item.name}}</el-button>
        </footer>
      </div>
    </div>
  </transition>

</template>

<script>
export default {
  name: 'HllDialog',
  props: {
    value: Boolean,
    autoClose: Boolean,
    width: [String, Number],
    title: [String],
    btnList: [Array],
    smallTitle: [String]
  },
  data () {
    return {
      dialogVisible: false,
      active: '',
      animateFlag: false,
    }
  },
  computed: {
    collapse() {
      return this.$store&&this.$store.state.collapse
    },
    footBtnList(){
      if(this.btnList) return this.btnList
      return [
        { action: 'cancel', type: '', name: '取消' },
        { action: 'submit', type: 'primary', name: '提交' }
      ]
    },
  },
  watch: {
    value: function (){
      this.dialogVisible = this.value
    }
  },
  methods: {
    close(){
      this.$emit('input', false)
      this.$emit('close')
    },
    handleAction(btn){
      if(this.autoClose && btn.action === 'cancel'){
        this.$emit('input', false)
      }
      this.$emit('action', btn)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$color: #f16622;          // theme color
$font-small: 12px;
$font-large: 18px;

.dialog-fade-enter-active {
  animation: dialog-fade-in .3s;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out .3s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}

.dialog-wrap:before{
  content: '';
  width: 100%;
  height: calc(100vh - 110px);
  background-color: rgba(0,0,0,.5);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.dialog-wrap{
  position: fixed;
  top: 110px;
  z-index: 5;
  .dialog-content{
    width: 700px;
    max-height: calc(100vh - 170px);
    display: flex;
    align-items: center;
    background-color: #fff;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    left: 50%;
    top: 30px;
    transform: translateX(-50%);
    z-index: 10;
    .dialog-header{
      width: 100%;
      height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      background-color: #eee;
      h1{
        width: 50%;
        height: 50px;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 20px;
        font-weight: normal;
        color: $color;
        font-size: $font-large;
        >i{
          font-size: $font-small;
          color: #999;
        }
      }
      .dialog-close{
        width: 50%;
        height: 50px;
        .el-dialog__headerbtn{
          top: 13px;
          right: 15px;
          .el-dialog__close{
            color: $color;
            font-size: 24px;
          }
        }
      }
    }
    .dialog-main{
      width: 100%;
      min-height: calc(100vh - 420px);
    }
    .dialog-submit{
      width: 100%;
      height: 50px;
      position: absolute;
      right: 0;
      bottom: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      background-color: #eee;
      padding-right: 20px;
      z-index: 10;
    }
  }
}
</style>
