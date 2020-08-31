<template>
  <div class="app">
    <div ref="home" class="container"></div>
  </div>
</template>

<script>
import mapSvg from './svgMap'
import meun from '../config'
const { nav = [], sidebar = {} } = meun.themeConfig
export default {
  methods: {
    getItemTree(data = []){
      if(!data.length) return []
      const createData = data.map(it => {
        let item = it
        if(typeof it === 'string') {
          item = {
            text: it.substring(it.lastIndexOf('/') + 1),
            link: '__' + it,
          }
        }
        let childs = item.items ?  (item.items) : (sidebar[item.link] || [])
        return {
          label: item.text,
          key: `${item.text}_${item.link || ''}`,
          type: (item.items || (item.link && item.link[item.link.length - 1] === '/')) ? 'dir' : 'text',
          children: this.getItemTree(childs)
        }
      })
      return createData
    },
    initSvgTree(){
      const svgTree = this.getItemTree(nav)
      const svg = mapSvg(svgTree, { title: 'Orchid' })
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