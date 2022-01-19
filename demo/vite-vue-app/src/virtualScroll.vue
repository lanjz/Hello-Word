<template>
  <div @scroll="scroll" style="height: 500px; overflow: auto;margin: 50px">
    <div :style="{height: h+'px'}">
      <div :style="{transform: `translateY(${top}px)`}">
        <div :style="{transform: `translateY(${inY}px)`}">
          <div v-for="item in list" :key="item.id" class="item">
            <component :is="renderItem" :item="item"></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  let itemHeight = 100
  let visibilityNum = 20
  export default {
    props: ['height', 'data', 'render'],
    data() {
      return {
        list: this.data.slice(0, visibilityNum),
        h: itemHeight * this.data.length,
        top: 0,
        inY: 0
      }
    },
    computed: {
      renderItem() {
        return this.render
      },
    },
    methods: {
      scroll(e) {
        let {scrollTop} = e.target
        let ind = Math.floor(scrollTop / 150)
        ind = Math.min(ind, 5000 - visibilityNum)
        // 如果取的最后一组数据，不需要模拟滚动
        if(ind === 5000 - visibilityNum) {
          this.inY = 0
        } else {
          this.inY = -Math.floor(scrollTop % 150)
        }
        if(this.lastInd !== ind) {
          this.lastInd = ind
          this.list = this.data.slice(ind, visibilityNum + ind)
        }
        this.top = scrollTop
        // Math.abc(...) 是滚动到底部时，列表应该所在的偏移量
        this.top = Math.min(scrollTop, Math.abs(scrollTop - (visibilityNum * itemHeight - 272)))
      }
    },
    mounted() {
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  * {
    box-sizing: border-box;
  }

  .item {
    height: 150px;
    border: solid 1px red
  }
</style>
