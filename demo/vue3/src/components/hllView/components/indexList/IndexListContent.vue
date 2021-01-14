<template>
  <div ref="indexContent">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "IndexListContent",
  componentAlias: "IndexListContent",
  props: ['index'],
  methods: {
    getDom(){
      let domNode = this.$refs['indexContent']
      while (domNode && domNode.parentNode && domNode.parentNode.tagName !== 'BODY' && domNode.parentNode.getAttribute('alias-name') !== 'scroll-content'){
        domNode = domNode.parentNode
      }
      return domNode
    },
    scrollUpdate(target){
      let domNode = this.getDom()
      if(domNode && target >= domNode.offsetTop && target < (domNode.offsetTop+domNode.clientHeight)){
        this.hllDispatch('IndexList', 'setActivity', [this.index])
      }
    },
    activity(index){
      if(index === this.index){
        let domNode = this.getDom()
        this.hllDispatch('IndexList', 'setScrollTo', [domNode, index])
      }
    }
  },
  created() {
    this.$on('scrollUpdate', this.scrollUpdate);
    this.$on('activity', this.activity);
  }
}
</script>

<style scoped>

</style>
