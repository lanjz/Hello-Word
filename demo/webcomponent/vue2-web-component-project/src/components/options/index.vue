<template>
  <div :style="style" v-if="visible" class="virtual-select-option">
    <div @scroll="scroll" :style="{height: boxHeight+'px', overflow: 'scroll'}">
      <div :style="{height: allHeight+'px'}">
        <div :style="{transform: `translateY(${top}px)`}">
          <div
              v-for="(item) in list" :key="item.id"
              @click="select(item)" style="height: 34px"
              class="el-select-dropdown__item"
              :class="{'selected': activeValue.code === item.code}"
          >
            {{item.label}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../bus'
let itemHeight = 34
let visibilityNum = 20
export default {
  props: {},
  data() {
    return {
      top: 0,
      boxHeight: 300,
      start: 0,
      data: [],
      filterList: [], // 过滤的列表
      inputValue: '',
      visible: false,
      box: {}
    }
  },
  computed: {
    style(){
      const { top, height, left }  = this.box
      return {
        top: top+height+'px',
        left: left + 'px',
        display: 'inline-block'
      }
    },
    allHeight(){
      return itemHeight * this.data.length
    },
    dataLen(){
      return this.data.length
    },
    list(){
      return this.filterList.slice(this.start, visibilityNum + this.start)
    },
    activeValue(){
      if(!this.value) {
        return { label: ''}
      } else {
        return this.userTemObj[this.value]
      }
    },
  },
  watch: {
    value: {
      handler: function (){
        if(!this.value) {
          this.inputValue = ''
          return
        }
        let item = this.value
        if(this.userTemObj[item]){
          this.inputValue = this.userTemObj[item].code
        } else {
          this.inputValue = item
        }
      },
      immediate: true
    },
    data(){
      this.init()
      this.filterData()
    },
  },
  created() {
    this.filterList = this.data
  },
  methods: {
    openOption(){
      this.showOption = true
    },
    closeOption(){
      this.showOption = false
    },
    filterData(key){
      clearTimeout(this.inputTime)
      this.inputTime = setTimeout(() => {
        if(!key){
          this.filterList = this.data
          return
        }
        this.filterList = this.data.filter(item => (item.label.indexOf(key)>-1))
      }, 500)
    },
    selectChange(val){
      console.log('selectChange', val)
      // let codes = val.map(item => item.substring(0, item.indexOf('(')))
      // this.$emit('input', codes)
      /*     if(this.multiple){

           }*/
    },
    doClear(){
      this.$emit('input', this.multiple ? []: '')
      this.$emit('callback', null)
    },
    select(item){
      if(this.multiple){
        let result = [...this.activeValue]
        let ind = result.findIndex(it => it.code === item.code)
        if(ind>-1){
          result.splice(ind, 1)
        } else {
          result.push(item)
        }
        bus.$emit('bus', result.map(item => item.code))
      } else {
        bus.$emit('selected', item.code)
      }
    },
    init(){
      this.top = 0
      this.start = 0
    },
    scroll(e) {
      let {scrollTop} = e.target
      let ind = Math.floor(scrollTop / itemHeight) // 从第几条数据开始显示
      ind = Math.min(ind, this.dataLen - visibilityNum)
      this.start = ind
      // Math.abc(...) 是滚动到底部时，列表应该所在的偏移量
      this.top = Math.min(scrollTop, Math.abs(scrollTop - (visibilityNum * itemHeight - this.boxHeight)))
    },
    bodyCloseMenus(e) {
      console.log(this.visible)
      if(this.visible){
        console.log(document.body.contains(this.$el))
        if (this.$el && !this.$el.contains(document.body)) {
          if(this.visible){
            this.visible = false;
          }
        }
      }
    }
  },
  mounted() {
    // document.addEventListener("click", this.bodyCloseMenus);
  },
  beforeDestroy() {
    // document.removeEventListener("click", this.bodyCloseMenus);
  },
}
</script>

<style>
.virtual-select-option{
  position: absolute;
  z-index: 1001;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  /*box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);*/
  box-sizing: border-box;
  margin: 5px 0;
  width: 240px;
  padding: 4px 0;
}
.el-select-dropdown__item{
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  box-sizing: border-box;
  cursor: pointer;
}
.el-select-dropdown__item:hover{
  background-color: #f5f7fa;
}
</style>
