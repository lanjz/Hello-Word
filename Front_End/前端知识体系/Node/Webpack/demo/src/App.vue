<template>
    <div>
        <div class="div1"></div>
        <div class="div2"></div>
        <h1>{{title}}</h1>
        <h1 @click="toggle()">SHOW/IF</h1>
        <div v-if="show">v-if</div>
        <div v-show="show">v-show</div>
        <div>{{provideData}}</div>
        <comA :arr="arr" ref="comA" abc="13" :ttt="arr" @abc="toggle" :title.sync="title"></comA>
    </div>
</template>
<script>
    import comA from './components/tempA.vue'
    import { EventBus } from './utils/index.js'
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
                }
            }
        },
        components: {
            comA
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
            }
        },
        mounted() {
            EventBus.$on('abc', function () {

            })
        }
    }
</script>