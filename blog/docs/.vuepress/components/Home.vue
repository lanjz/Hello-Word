<template>
  <div ref="home"></div>
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
      const svg = mapSvg({ label: 'LAN_JZ', children: svgTree })
      this.$refs['home'].appendChild(svg)
    }
  },
  mounted() {
    this.initSvgTree()
  }
}
</script>

<style>

</style>