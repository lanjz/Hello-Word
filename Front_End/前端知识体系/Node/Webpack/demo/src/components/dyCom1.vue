<template>
    <h2>动态组件一{{t}}</h2>
</template>
<script>
    export default {
        data(){
            return {
                t: 1
            }
        },
        activated() {
            console.log('activated')
        },
        updated(){
            console.log('updated')
        },
        mounted() {
            console.log('mounted', this)
        }
    }
</script>