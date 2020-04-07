<template>
    <div>
        <h1 @click="toggle()">SHOW/IF</h1>
        <div v-if="show">v-if</div>
        <div v-show="show">v-show</div>
        <div>{{arr}}</div>
        <com1 :arr="arr"></com1>
    </div>
</template>
<script>
    import com1 from './components/temp1.vue'
    export default {
        data:function () {
            return {
                show: false,
                arr: [1,2,3]
            }
        },
        components: {
            com1
        },
        watch: {
            arr: function (val) {
                console.log('val', val)
            }
        },
        methods: {
            toggle() {
                this.show = !this.show
            }
        }
    }
</script>