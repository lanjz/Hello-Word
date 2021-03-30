<template>
  <div class="app">
    <div ref="home" class="container"></div>
  </div>
</template>

<script>
// import mapSvg from './svgMap'
import mapSvg from 'svg-mind-js'
import meun from '../config'
const { nav = [], sidebar = {} } = meun.themeConfig
export default {
  methods: {
    getItemTree(data = [], prefix = ''){
      if(!data.length) return []
      let createData = []
      data.forEach(it => {
        let item = it
        if(item.ignore) return
        const one = {
          label: item.text,
          key: `${prefix}${item.link || ''}`,
          type: (item.items || (item.link && item.link[item.link.length - 1] === '/')) ? 'dir' : 'text',
          children: this.getItemTree(item.items, item.link)
        }
        createData.push(one)
      })
      return createData
    },
    initSvgTree(){
      let _this = this
      const rootStyle = {
        fill: '#272b2d',
      }
      const rectStyle = {
        'border-radius': '4',
        padding: '2 8',
        color: '#fff',
        fill: '#a3c6c0',
      }
      const textStyle = {
        color: '#fff',
      }
      let options = {
        title: 'Orchid',
        className: 'abc',
        rectStyle,
        textStyle,
        rootStyle,
        callback(data) {
          if(data.key){
            _this.$router.push({
              path: `${data.key}${data.type === 'text' ? '.html': ''}`
            })
          }

        },
      }
      const svgTree = this.getItemTree(nav)
      const svg = mapSvg(svgTree,options)
      this.$refs['home'].appendChild(svg)
    }
  },
  mounted() {
    this.initSvgTree()
  }
}
</script>

<style scope>
.app{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #272b2d;
}
.container{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

}
</style>