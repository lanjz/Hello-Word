<template>
  <div class="nav-svg">
    <div ref="home" class="container"></div>
  </div>
</template>

<script>
import mapSvg from './svgMap'
import meun from '../config'
const { nav = [], sidebar = {} } = meun.themeConfig
export default {
  methods: {
    getItemTree(data = [], prefix = ''){
      if(!data.length) return []
      let createData = []
      data.forEach(it => {
        const { path } = this.$route
        let label, key, type
        if(typeof it === 'string'){
            label = it.substring(it.lastIndexOf('/') + 1)
            key = it
            type = 'text'
        } else {
            label = it.title
            key = `${path}${it.title}`
            type = (it.children && it.children.length) ? 'dir' : 'text'
        }
        const one = {
          label,
          key,
          type,
          children: type === 'dir' ? this.getItemTree(it.children) : []
        }
        createData.push(one)
      })
      return createData
    },
    initSvgTree(){
      const { path } = this.$route
      const svgTree = this.getItemTree(sidebar[path])
      const name = path.substring(1, path.length-1)
      console.log('svgTree', svgTree)
      const svg = mapSvg(svgTree, { title: name, theme: 'light' })
      this.$refs['home'].appendChild(svg)
    }
  },
  mounted() {
    this.initSvgTree()
  }
}
</script>

<style scope>
.nav-svg{
  width: 100%;
  height: 100%;
  background: #272b2d;
}
.container{

}
</style>