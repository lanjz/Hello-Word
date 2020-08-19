<template>
    <h2>动态组件一</h2>
</template>
<script>
  // import obj, { add } from '../utils/index'
  // let {obj, add} = require('../utils/commonJS')
    export default {
      methods: {
        do(){
          console.log(obj)
          add()
          console.log(obj)
        }
      },
      mounted() {
        console.log('二', this)
      }
    }
</script>