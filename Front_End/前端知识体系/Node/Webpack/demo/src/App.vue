<template>
    <div>
        <div>{{obj}}</div>
        <div class="div1"></div>
        <div class="div2"></div>
        <h1>{{title}}</h1>
        <h1 @click="toggle()">SHOW/IF</h1>
        <div v-if="show">v-if</div>
        <div v-show="show">v-show</div>
        <div>{{provideData}}</div>
        <comA :arr="arr" ref="comA" abc="13" :ttt="arr" @abc="toggle" :title.sync="title"></comA>
        <h1 @click="currentTabComponent = 'dyCom1'">动态组件1</h1>
        <h1 @click="currentTabComponent = 'dyCom2'">动态组件2</h1>
        <keep-alive>
            <component v-bind:is="currentTabComponent"></component>
        </keep-alive>
    </div>
</template>
<script>
    import comA from './components/tempA.vue'
    import { EventBus } from './utils/index.js'
    import dyCom1 from './components/dyCom1.vue'
    import dyCom2 from './components/dyCom2.vue'
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
            comA,
            dyCom1,
            dyCom2
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
            }
        },
        mounted() {
          console.log(this)
            EventBus.$on('abc', function () {

            })
          axios.get('http://www.localhost:10011')
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
    }
</script>