<template>
    <div class="abc">动态组件一{{t}}</div>
</template>
<script>
  import obj, { add } from '../utils/index'
  // let {obj, add} = require('../utils/commonJS')
  export default {
    data(){
      return {
        t: 1
      }
    },
    methods: {
      do(){
        console.log(obj)
        add()
        console.log(obj)
      }
    },
    activated() {
      console.log('activated')
    },
    updated(){
      console.log('updated')
    },
    mounted() {
      console.log('mounted', this)
      console.log('this.$attrs', this.$attrs)
      console.log('this.$listeners', this.$listeners)
    },
    activated() {
      console.log('activated')
    }
  }
</script>
<style>
.abc{
  font-size: 100px;
}
</style>