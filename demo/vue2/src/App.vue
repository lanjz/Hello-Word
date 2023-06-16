<template>
  <div id="app" class="global-flex">
    <AppSideMenu />
    <router-view class="main-container global-flex-column global-flex-1" />
  </div>
</template>
<script>
import AppSideMenu from './layout/app-side-menu'
import emitter from '@/utils/emitter';
import { EventBus } from '@/utils/helpe'
export default {
  name: 'root-app',
  componentName: 'root-app',
  mixins: [emitter],
  components: {
    AppSideMenu
  },
  data(){
    return {
      name: ''
    }
  },
  methods: {
    beginBroadcast(componentName, eventName, params) {
      console.log('111')
      this.broadcast(componentName, eventName, params)
    },
  },
}
</script>
<style lang="scss" scoped>
.main-container{
  overflow: auto;
}
</style>
