<template>
  <div class="index-num">
    <div v-for="i in list" :key="i" class="item" :class="{'act': act === i}">{{i}}</div>
  </div>
  <div class="scrollBox-box">
    <div class="base" ref="scrollBox">
      <div class="scrollBox" >
        <div v-for="i in list" :key="i" class="item" :alias="i" ref="indexItem">
          {{i}}
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "IndexList",
  data(){
    return {
      list: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'Z'],
      act: 'A'
    }
  },
  methods: {
    initInterSectionObserver(){
      console.log('this.$refs.scrollBox', this.$refs.scrollBox)
      if(this.interSectionInstance) return
      let rootDom =this.$refs.scrollBox
      let options = {
        root: rootDom,
        rootMargin: '0px',
        threshold: 0,
      }
      let _this = this
      this.interSectionInstance = new IntersectionObserver(function (entries, observer){
        entries.forEach(entry => {
          console.log('entry', entry)
          if(entry.isIntersecting){
            _this.act = entry.target.getAttribute('alias')
          }
          // Each entry describes an intersection change for one observed
          // target element:
          //   entry.boundingClientRect
          //   entry.intersectionRatio
          //   entry.intersectionRect
          //   entry.isIntersecting
          //   entry.rootBounds
          //   entry.target
          //   entry.time
        });
      }, options);
      (rootDom.querySelectorAll('.item')||[]).forEach(item => {
        this.interSectionInstance.observe(item)
      })

    }
  },
  mounted() {
    this.initInterSectionObserver()
  }
}
</script>

<style scoped lang="scss">
.index-num{
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  width: 20px;
  text-align: center;
  color: #fff;
  padding: 20px 0;
  border-radius: 10px;
  .item{
    line-height: 30px;
  }
  .item.act{
    color: #3eaf7c;
    font-size: 19px;
  }
}

.scrollBox-box{
  width: 80%;
  height: 500px;
  position: relative;
  margin-top: 70px;
  .base{
    //background: red;
    height: 10px;
    z-index: 2;
    width: 100%;
    position: absolute;
  }
}
.scrollBox{
  border: solid 1px #000;
  overflow: auto;
  position: absolute;
  height: 500px;
  width: 100%;
  .item{
    height: 300px;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    border-bottom: solid 1px #666;
  }
}
</style>