<template>
  <div class="app">
    <div ref="home" class="container"></div>
  </div>
</template>

<script>
// import mapSvg from './svgMap'
import mapSvg from 'svg-mind-js'
import menu from '../config'
const { nav = [], sidebar = {} } = menu.themeConfig
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
.home-page{
  min-height: 100vh;
  background: #272b2d;
  padding-top: 3.6rem;
}
</style>