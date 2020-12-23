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
      while (domNode && domNode.parentNode && domNode.parentNode.tagName !== 'BODY' && domNode.parentNode.getAttribute('alias-name') !== 'index-list'){
        domNode = domNode.parentNode
      }
      return domNode
    },
    update(target){
      let domNode = this.getDom()
      if(domNode && target >= domNode.offsetTop && target < (domNode.offsetTop+domNode.clientHeight)){
        this.hllDispatch('IndexList', 'setActivity', [this.index])
      }
    },
    activity(index){
      if(index === this.index){
        let domNode = this.getDom()
        this.hllDispatch('IndexList', 'setScrollTo', [domNode.offsetTop])
      }
    }
  },
  created() {
    this.$on('update', this.update);
    this.$on('activity', this.activity);
  }
}
</script>

<style scoped>

</style>