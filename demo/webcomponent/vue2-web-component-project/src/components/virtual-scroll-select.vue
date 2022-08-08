<template>
  <div style="display: inline-block" ref="virtualRef" @click="toggleOption">
    <input class="el-input" ></input>
  </div>
</template>

<script>
import toast from './options/index.js'
import bus from './bus'
  let visibilityNum = 20
  export default {
    props: {
      listSrt: String,
      userTemObj: Object,
      disabled: Boolean,
      value: {
        type: String,
      }
    },
    data() {
      return {
        top: 0,
        boxHeight: 300,
        start: 0,
        inputValue: '',

      }
    },
    computed: {
      data(){
        if(this.listSrt){
          return JSON.parse(this.listSrt)
        }
        return []
      }
    },
    methods: {
      toggleOption(){
        setTimeout(() => {
          console.log('this.optinsEl', this.listSrt)
          this.optinsEl = toast({
            title: '成功显示了',
            duration: 2000,
            data: this.data,
            box: this.$refs['virtualRef'].getBoundingClientRect()
          })
          console.log('this.optinsEl', this.optinsEl)
        })
      },
      closeOption(){
        this.optinsEl.visible = false
      },
      selected(ses){
        this.$emit('input', ses)
        this.$emit('callback', ses)
        this.closeOption()
      },
      bodyCloseMenus(e) {
        if(this.optinsEl && this.optinsEl.visible){
         if(!this.optinsEl.$el.contains(e.target)){
           this.closeOption()
         }
        }
      }
    },
    destroyed() {
      bus.$off('selected', this.selected)
      document.removeEventListener("click", this.bodyCloseMenus);
    },
    mounted() {
      console.log('data', this.data)
      bus.$on('selected', this.selected)
      document.addEventListener("click", this.bodyCloseMenus);
    }
  }
</script>

