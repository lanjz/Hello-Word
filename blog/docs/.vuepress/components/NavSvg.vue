<template>
  <div class="nav-svg">
    <div ref="home" class="in-page"></div>
  </div>
</template>

<script>
import mapSvg from 'svg-mind-js'
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
      let deCodePath = decodeURI(path)
      const svgTree = this.getItemTree(sidebar[deCodePath])
      const name = deCodePath.substring(1, deCodePath.length-1)
      const _this = this
      const svg = mapSvg(svgTree, {
        title: name,
        callback(tar) {
          console.log('tar', tar)
          _this.$router.push({
            path: `${tar.key}${tar.type === 'text' ? '.html': ''}`
          })
        }
      })
      this.$refs['home'].appendChild(svg)
    },
    initPage(){
      let navBar = document.querySelector('.navbar')
      if(navBar) {
        navBar.getBoundingClientRect().height
      }
      const navH = document.querySelector('.navbar').getBoundingClientRect().height
      console.log()
    }
  },
  mounted() {
    this.initPage()
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
.in-page{
  min-height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
</style>