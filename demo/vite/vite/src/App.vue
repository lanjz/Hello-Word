<template>
  <div @scroll="scroll" style="height: 500px; overflow: auto">
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
  let listSource = []
  for (let i = 0; i < 5000; i++) {
    listSource.push({
      label: 'label：' + i,
      id: i
    })
  }

  let list = listSource.slice(0, 30)
  let h = 50 * 5000
  let bottom = h - 30 * 50
  export default {
    data() {
      return {
        list,
        h,
        top: 0,
        bottom,
        inY: 0
      }
    },
    methods: {
      scroll(e) {
        /*
                if(this.isDo) return
                this.isDo = true
                setTimeout(() => {
                  this.isDo = false
                }, 10)
        */

        let {scrollTop} = e.target
        let ind = Math.floor(scrollTop / 50)
        this.inY = -Math.floor(scrollTop % 50)
        this.list = listSource.slice(ind, 30 + ind)
        this.top = scrollTop
        // this.bottom = bottom - scrollTop
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
    height: 50px;
    border: solid 1px red
  }
</style>
