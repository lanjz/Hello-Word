<template>
  <div>
    <h1>父应用Store：</h1>
    {{$baseStore&&$baseStore.state||'当前为独立运行模式'}}
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('userinfo', ['useinfo'])
  },
  methods: {
    ...mapActions('userinfo', ['getUserinfo'])
  },
  mounted() {
  }
}
</script>
<style scoped lang="scss">
.app-logo{
  height: 60px;
  color: #fff;
  line-height: unset;
  padding: 10px;
  .logo{
    height: 40px;
    width: auto;
  }
  .name{
    margin-left: 10px;
    font-size: 14px;
  }
}
</style>

