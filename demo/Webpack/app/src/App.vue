<template>
    <div class="app">
        <div class="test">一地的节操</div>
        <!--<keep-alive>
            <dyCom1></dyCom1>
        </keep-alive>
        <span ref="abc" v-if="show">{{$store.state}}</span>
        <div ref="abc">{{$store.state}}</div>
        <span v-for="(item) in list" ref="abcd">{{item}}</span>
        <router-view></router-view>-->
      <!--   <h1>h1</h1>
        <video
          class="m-player"
        >
            <source src="https://www.runoob.com/try/demo_source/movie.mp4" type="video/mp4">
            您的浏览器不支持 video 标签。
        </video> -->
      <div class="bottom"></div>
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
<style>
  .bottom {
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
    background: black;
  }
    .app{
      background: #3eaf7c;
      height: 2000px;
        font-size: 100px;
    }
    .m-player{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: solid 1px red;
    }
    .test{
      font-size: 20px;
      border: solid 1px red;
      width: 375px;
      height: 375px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
</style>