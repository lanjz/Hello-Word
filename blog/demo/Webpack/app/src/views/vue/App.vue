<template>
    <div>
        <h1>APP</h1>
        <span @click="handle">{{title}}</span>
   <!--     <router-link to="/foo">Go to Foo</router-link>
        <router-link to="/bar">Go to Bar</router-link>
        <div style="color: red">{{obj}}</div>

       -->
        <!-- <dyCom1 name="lanjz" class="com" age="18" @click="callback" v-on:event-one="callback" v-on:event-two="callback"></dyCom1> -->
        <com1></com1>

    </div>
</template>
<script>
    import com1 from './pages/car.vue'
    export default {
        data:function () {
            return {
                title: 'title',
            }
        },
      components: { com1 },
      methods: {
        handle() {
          this.title = 'new title'
        }
      },
        mounted() {
          console.log(this)
        },
      updated() {
          console.log('up-app')
      }
    }
</script>
<style lang="less">
  div {
    color: blue;
  }
</style>
