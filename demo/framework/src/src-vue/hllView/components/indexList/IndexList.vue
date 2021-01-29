<template>
  <div class="index-list">
    <ul v-if="indexMenu.length" class="index-list-menu">
      <li
          v-for="(item, index) in indexMenu"
          :key="index"
          @click="selectIndex(item.index)"
      >
        <span class="dot"></span>
        <span class="title">{{ item.label }}</span>
      </li>
      <li class="actIndex" :style="{ top: curIndex * 45 + 'px' }"></li>
    </ul>
    <div
      class="scroll-content"
      @scroll.passive="scroll"
      alias-name="scroll-content"
      ref="scroll-content"
      @mousewheel="mousewheel"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexList",
  componentAlias: "IndexList",
  props: {
    defaultActivity: {}, // 默认选中哪个值
    indexList: { // 索引列表
      default(){
        return []
      }
    }
  },
  data(){
    return {
      actIndex: this.defaultActivity, // 记录单高亮的菜单
      curIndex: -1, // 菜单使用
      indexMenu: [],
    };
  },
  watch: {
    indexList:{
      handler: function (val){
        if(val&&val.length){
          this.indexMenu = [ ...val ]
        }
      },
      immediate: true
    }
  },
  methods: {
    mousewheel(){
      this.isHandleScroll = null // 在滚动过程又触发了滚轮滚动，将手动滚动的标志直接清除
    },
    scroll(e){
      if(this.isHandleScroll) { // 表示 scrollTo 触发的滚动
        if (e.target.scrollTop === this.isHandleScroll.target) {
          this.isHandleScroll.callback();
        }
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        //方法一： 只适用于IndexContent是IndexList的直接子内容
/*        let dom = this.$refs['scroll-content']
        let { firstChild } = dom
        // offsetTop 是处理父元素有 padding 的情况
        let scrollTop = Math.max(firstChild && firstChild.offsetTop || 0, e.target.scrollTop)
        this.hllBroadcast('IndexListContent', 'scrollUpdate', [scrollTop])*/
        // 方法二:
        this.startQueue()
      }, 100)
    },
    startQueue(){
      let subQueue = []
      function getDom(dom){
        subQueue.push(dom)
      }
      this.hllBroadcast('IndexListContent', 'callBackInstance', [getDom])
      this.$nextTick(() => {
        let ind = null
        let min = 0
        const { y: pY } = this.$refs['scroll-content'].getBoundingClientRect()
        subQueue.forEach(item => {
          const { y } = item.getBoundingClientRect()
          let dis = y - pY
          if(ind === null){
            ind = item.index_index
            min = dis
          } else if(dis <= 0 && Math.abs(dis) < Math.abs(min)){
            min = dis
            ind = item.index_index
          }
          this.setActivity(ind)
        })
      })
    },
    setActivity(key){
      if(this.actIndex !== key){
        this.actIndex = key
        this.curIndex = this.indexMenu.findIndex(item => item.index == key)
        this.$emit('change', key)
      }
    },
    selectIndex(index){
      this.hllBroadcast('IndexListContent', 'activity', [index])
    },
    /**
     * @prams {DOM}targetDom 子元素dom
     * @prams {Number}index 子元素 index值
     * */
    scrollTo(targetDom, index){
      let target
      // 方法一： 直接获取index在offsetTop， 但是这种只适用于IndexContent是IndexList的直接子内容
      // target = targetDom.offsetTop

      // 方法二：通过 绝对的位置的差值，获取 IndexList 应该滚动的位置
      let scrollContentDom = this.$refs['scroll-content']
      const { y: contentY} =  this.$refs['scroll-content'].getBoundingClientRect()
      const { y } =  targetDom.getBoundingClientRect()
      target = scrollContentDom.scrollTop + (y-contentY)
      // 方法二结束
      this.setActivity(index) // 激活菜单
      this.isHandleScroll = {
        index,
        target,
        callback: () => {
          this.isHandleScroll = null
        }
      }
      this.$refs['scroll-content'].scrollTo({
        top: target,
        behavior: 'smooth'
      })
    },
    setIndexMenu(info){
      console.log('info', info)
      if(this.indexList.length) return // 使用 props菜单
      const { index} = info
      let find = this.indexMenu.find(item => item.index === index)
      if(find){
        console.error(`已存在index:${index}索引`)
        return
      }
      this.indexMenu.push(info)
      this.indexMenu = this.indexMenu.sort((a, b) => a.index > b.index)
    },
    setDefault(){
      if(this.defaultActivity){
        let find = this.indexMenu.find(item => item.index == this.defaultActivity)
        if(find){
          this.selectIndex(find.index)
          return
        }
      }
      this.startQueue()
    }
  },
  created() {
    this.$on('setActivity', this.setActivity);
    this.$on('setScrollTo', this.scrollTo); // 接收当前应该滚动的位置
    this.$on('setIndexMenu', this.setIndexMenu); // 接收添加锚点菜单
  },
  mounted(){
    this.setDefault()
  }
}
</script>

<style scoped lang="scss">
.index-list{
  height: 100%;
  position: relative;
  display: flex;
  .index-list-menu{
    height: 100%;
    position: relative;
    margin: 0;
    padding: 0;
    width: 160px;
    overflow-y: auto;
    background-color: #aeaeae;
    li{
      display: flex;
      align-items: center;
      width: 100%;
      padding-left: 40px;
      height: 45px;
      color: #eee;
      font-size: 14px;
      position: relative;
      cursor: pointer;
      transition: all .1s ease;
      margin: 0;
      list-style: none;
      z-index: 1;
    }
    li:after{
      content: "";
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #eee;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    li:before{
      display: block;
      content: "";
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-right: 7px solid #fff;
      border-bottom: 7px solid transparent;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    li.actIndex:after, li.actIndex:before{
      display: none;
    }
    li.actIndex{
      background-color: #f16622;
      transition: all .2s ease-out;
      color: #fff;
      position: absolute;
      top: 0;
      z-index: 0;
    }
  }

  .scroll-content{
    flex: 1;
    height: 100%;
    position: relative;
    overflow: auto;
  }
  .actIndex{
    color: #fff;
  }
}
</style>
