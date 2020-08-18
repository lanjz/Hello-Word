<template>
    <div>
        <span ref="abc" v-if="show">{{$store.state}}</span>
        <div ref="abc">{{$store.state}}</div>
        <span v-for="(item) in list" ref="abcd">{{item}}</span>
        <dyCom1>

        </dyCom1>
        <dyCom2></dyCom2>
    </div>
</template>
<script>
    import comA from './components/tempA.vue'
    import axios from 'axios'
    import store from '../src/store/index'
    import toast from '../plugins/toast/toast'
    import dyCom1 from "./components/dyCom1.vue";
    import dyCom2 from "./components/dyCom2.vue";
    export default {
      components: {
        dyCom1,
        dyCom2
      },
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
        toast({
          title: 'abc'
        })
        }
    }
</script>