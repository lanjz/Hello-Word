<template>
  <div ref="indexContent">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "IndexListContent",
  componentAlias: "IndexListContent",
  props: ['index', 'label'],
  methods: {
    getDom(){
      let domNode = this.$refs['indexContent']
/*      while (domNode && domNode.parentNode && domNode.parentNode.tagName !== 'BODY' && domNode.parentNode.getAttribute('alias-name') !== 'scroll-content'){
        domNode = domNode.parentNode
      }*/
      return domNode
    },
    /**
     * 方法一使用
     * @param {Number} target  index容器滚动高度
     * */
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
    },
    callBackInstance(fn){
      let domNode = this.getDom()
      domNode.index_index = this.index
      fn(domNode)
    }
  },
  created() {
    this.$on('scrollUpdate', this.scrollUpdate);
    this.$on('activity', this.activity);
    this.$on('callBackInstance', this.callBackInstance);
    this.hllDispatch('IndexList', 'setIndexMenu', { index: this.index, label: this.label});
  },
}
</script>

<style scoped>

</style>
