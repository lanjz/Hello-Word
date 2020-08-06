<template>
    <div>
        <span ref="abc" v-if="show">{{$store.state}}</span>
        <div ref="abc">{{$store.state}}</div>
        <span v-for="(item) in list" ref="abcd">{{item}}</span>
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
              list: [1,3],
              show: false
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