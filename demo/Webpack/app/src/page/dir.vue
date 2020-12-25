<template>
    <div class="box" v-loading-line="tt" loading-line-attach=".box3" position="bottom">
        Stick me 200px from the top of the page
        <div class="box2">
            <div class="box3">1</div>
        </div>
    </div>
</template>
<script>
    export default {
      data: function () {
        return {
          tt: false
        }
      },
      mounted() {
        console.log(this)
      }
    }
</script>
<style>
    .box{
        margin-top: 100px;
        height: 100px;
        background: #999999;
    }
    .box2{
        border: solid 1px black;
        padding: 10px;
    }
    .box3{
        border: solid 1px red;
        height: 50px;
    }
</style>