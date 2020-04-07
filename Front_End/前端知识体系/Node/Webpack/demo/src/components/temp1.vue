<template>
    <div>
        <h1 @click="deal">子组件</h1>
        <div>{{arr}}</div>
    </div>
</template>
<script>
    export default {
        props: ['arr'],
        data: function () {
            return {}
        },
        methods: {
            deal() {
                this.arr.splice(4, 0, 0)
                console.log(this.arr)
            }
        }
    }
</script>