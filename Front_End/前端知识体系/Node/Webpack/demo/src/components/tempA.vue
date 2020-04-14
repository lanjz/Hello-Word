<template>
    <div>
        <h1 @click="deal">子组件</h1>
        <div>{{arr}}</div>
        <div>{{name}}</div>
        <tempB></tempB>
    </div>
</template>
<script>
    import tempB from './tempB.vue'
    export default {
        props: ['arr'],
        components: {
            tempB
        },
        data: function () {
            return {
                name: 12000
            }
        },
        methods: {
            deal() {
                this.$emit('update:title', 'newTitle')
                this.arr.splice(4, 0, 0)
                console.log(this.$parent.show = !this.$parent.show)
            },
            parent(th) {
                console.log(th)
            }
        },
        mounted() {
            console.log(this.$attrs)
            console.log(this.$listeners)
        }
    }
</script>