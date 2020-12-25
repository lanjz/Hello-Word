<template>
    <transition name="fade">
        <div class="wrap" v-show="visible">{{title}}</div>
    </transition>
</template>
<script>
  export default {
    data(){
      return {
        title: '',
        visible: false,
      }
    },
  }
</script>

<style scoped>
    .wrap{
        position: fixed;
        left: 50%;
        top:100px;
        background: rgba(0,0,0,.6);
        padding: 10px;
        border-radius: 5px;
        /*transform: translateX(-50%);*/
        color:#fff;
        max-width: 400px;
        min-width: 100px;
        font-size: 15px;
        text-align: center;
        z-index: 9999;
    }
    .fade-enter-active, .fade-leave-active {
        transition: .3s ease-out;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(-20px);
    }
    /*  .fade-enter-to, fade-leave{
        opacity: 1;
        transform: translateY(50px);
      }*/
</style>