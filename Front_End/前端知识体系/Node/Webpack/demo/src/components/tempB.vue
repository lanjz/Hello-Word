<template>
    <div>
        <h1 @click="deal">组件B</h1>
        <div>inject的值：{{provideData}}</div>
    </div>
</template>
<script>
    export default {
        props: ['arr'],
        inject: ['provideData'],
        data: function () {
            return {
                name: 12000,
                forName: this.provideData
            }
        },
        methods: {
            deal() {
            }
        }
    }
</script>