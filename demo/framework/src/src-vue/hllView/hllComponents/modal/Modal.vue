<template>
  <transition name="modal-fade">
    <div
        v-show="dialogVisible"
        class="modal-wrap"
        :style="[
      {'left': collapse ? '64px' : '240px'},
      {'width': collapse ? 'calc(100vw - 64px)' : 'calc(100vw - 240px)'}
    ]">
      <div class="m-content" :style="[{'width': `${width||700}px`}]">
        <header class="modal-header">
          <h1>
            {{title}}
            <i v-if="smallTitle" class="hll-small-small-title">{{smallTitle}}</i>
          </h1>
          <div class="modal-close">
            <button type="button" class="el-dialog__headerbtn" @click="close">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
        </header>
        <section class="modal-main">
          <slot></slot>
        </section>
        <footer class="modal-submit" v-if="footBtnList.length">
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
  name: 'HllModal',
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

.modal-fade-enter-active {
  animation: modal-fade-in .3s;
}

.modal-fade-leave-active {
  animation: modal-fade-out .3s;
}

@keyframes modal-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes modal-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}

.modal-wrap:before{
  content: '';
  width: 100%;
  height: calc(100vh - 110px);
  min-height: calc(100vh - 320px);
  background-color: rgba(0,0,0,.5);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.modal-wrap{
  position: fixed;
  top: 110px;
  z-index: 5;
  .m-content{
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    background-color: #fff;
    z-index: 1;
    .modal-header{
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
      .modal-close{
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
    .modal-main{
      width: 100%;
      height: calc(100vh - 270px);
      //min-height: 300px;
      //max-height: calc(100vh - 270px);
      overflow: auto;
    }
    .modal-submit{
      width: 100%;
      height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      background-color: #eee;
      padding-right: 20px;
    }
  }
}
</style>
