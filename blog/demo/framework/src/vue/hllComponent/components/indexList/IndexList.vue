<template>
  <div class="index-list">
    <ul v-if="indexList.length" class="index-list-menu">
      <li
          v-for="(item, index) in menuList"
          :key="index"
          @click="selectIndex(item.key)"
      >
        <span class="dot"></span>
        <span class="title">{{ item.label }}</span>
      </li>
      <li class="actIndex" :style="{ top: curIndex * 45 + 'px' }"></li>
    </ul>
    <div class="scroll-content" @scroll.passive="scroll" alias-name="scroll-content" ref="scroll-content">
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
  data() {
    const menuList = []
    let curIndex = 0
    this.indexList.forEach((item, index) => {
      let data = typeof item === 'string' ? {key: item, label: item} : item
      menuList.push(data)
      if(data.key === this.defaultActivity){
        curIndex = index
      }
    })
    return {
      actIndex: this.defaultActivity,
      menuList,
      curIndex
    };
  },
  methods: {
    scroll(e){
      if(this.isHandleScroll) { // 表示 scrollTo 触发的滚动
        if (e.target.scrollTop === this.isHandleScroll.target) {
          this.isHandleScroll.callback();
        }
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hllBroadcast('IndexListContent', 'scrollUpdate', [e.target.scrollTop])
      }, 100)
    },
    setActivity(key){
      if(this.actIndex !== key){
        this.actIndex = key
        this.curIndex = this.menuList.findIndex(item => item.key === key)
        this.$emit('change', key)
      }
    },
    selectIndex(index){
      this.hllBroadcast('IndexListContent', 'activity', [index])
    },
    scrollTo(targetDom, index){
      let dis = this.$refs['scroll-content'].clientHeight - targetDom.clientHeight
      let target = dis > 0 ? targetDom.offsetTop - dis : targetDom.offsetTop
      this.setActivity(index)
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
    }
  },
  created() {
    this.$on('setActivity', this.setActivity);
    this.$on('setScrollTo', this.scrollTo);
  }
}
</script>

<style scoped>
.index-list{
  background: #666666;
  height: 100%;
  position: relative;
  display: flex;
  .index-list-menu{
    height: 100%;
    position: relative;
    margin: 0;
    padding: 0;
    width: 160px;
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