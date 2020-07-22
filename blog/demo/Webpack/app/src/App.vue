<template>
    <div>
        <div>{{$store.state}}</div>
        <div>{{name}}</div>
    </div>
</template>
<script>
    import comA from './components/tempA.vue'
    import axios from 'axios'
    import store from '../src/store/index'
    export default {
        data:function () {
            return {
                title: 'title',
            }
        },
        watch: {
            arr: function (val) {
                console.log('val', val)
            }
        },
        methods: {
        },
      beforeCreate() {
          this.name = 'lan'
      },
      mounted() {
          console.log('this', this)
        }
    }
</script>