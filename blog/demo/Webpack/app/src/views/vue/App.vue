<template>
    <div>
        <div style="color: red">{{obj}}</div>
        <div class="div12">1</div>
        <div class="div2"></div>
        <h1>{{title}}</h1>
        <h1 @click="toggle()">SHOW/IF</h1>
        <div v-if="show">v-if</div>
        <div v-show="show">v-show</div>
        <div>{{provideData}}</div>
        <!-- <comA :arr="arr" ref="comA" abc="13" :ttt="arr" @abc="toggle" :title.sync="title"></comA> -->
        <h1 @click="currentTabComponent = 'dyCom1'">动态组件1</h1>
        <h1 @click="currentTabComponent = 'dyCom2'">动态组件2</h1>
        <keep-alive>
            <!-- <component v-bind:is="currentTabComponent"></component> -->
        </keep-alive>
        <!-- <dyCom1 name="lanjz" class="com" age="18" @click="callback" v-on:event-one="callback" v-on:event-two="callback"></dyCom1> -->
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        provide () {
            return {
                provideData: this.provideData,

            }
        },
        data:function () {
            return {
                title: 'title',
                show: false,
                arr: [1,2,3],
                provideData: {
                    name: 'lanjz'
                },
                currentTabComponent: 'dyCom1',
              obj: {
                  a: [{name: 'lanjz'}]
              }
            }
        },
        components: {
          
        },
        watch: {
            arr: function (val) {
                console.log('val', val)
            }
        },
        methods: {
            toggle() {
                this.show = !this.show
                console.log(this.$children[0].name = 12)
                console.log('this', this)
            },
            toggle: () => {
                console.log('this', this)
            },
            callback(){

            }
        },
        mounted() {
          console.log(this)
          console.log(11)
    
        /*   axios.get('http://www.localhost:10011')
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            }); */
        }
    }
</script>
<style lang="less">
  div {
    color: blue;
  }
</style>
