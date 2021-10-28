<template>
  <template>
    <div>
      <div style="height: 50px"></div>
    </div>
    <div @scroll="scroll" style="height: 500px; overflow: auto;margin: 50px">
      <div :style="{height: h+'px'}">
        <div :style="{transform: `translateY(${top}px)`}">
          <div :style="{transform: `translateY(${inY}px)`}">
            <div v-for="item in list" :key="item.id" class="item">
              {{item.label}}
            </div>
          </div>
        </div>
      </div>
    </div>

  </template>

  <script>
    let listNumber = 5000
    let itemHeight = 150
    let visibilityNum = 30

    let listSource = [] // 数据模拟
    for (let i = 0; i < listNumber; i++) {
      listSource.push({
        label: 'label：' + i,
        id: i,
        name: 'Name:' + i,
        content: 'contentcontentcontentcontentcontentcontentcontent'
      })
    }

    let list = listSource.slice(0, visibilityNum) // 初始显示值
    let h = listNumber * itemHeight // 总高
    export default {
      data() {
        return {
          list,
          h,
          top: 0,
          inY: 0
        }
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
            this.list = listSource.slice(ind, visibilityNum + ind)
          }
          this.top = scrollTop
          // Math.abc(...) 是滚动到底部时，列表应该所在的偏移量
          this.top = Math.min(scrollTop, Math.abs(scrollTop - (visibilityNum * itemHeight - 500)))
        }
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

</template>

<script>
  export default {
    name: "virtualDemo"
  }
</script>

<style scoped>

</style>