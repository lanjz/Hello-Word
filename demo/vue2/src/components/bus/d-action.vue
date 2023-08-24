<template>
  <div class="global-action-wrap">
    <el-button
        type="primary"
        v-for="(btn, index) in actions"
        @click="handleClick(btn)"
        :key="index"
        v-bind="btn"
    >
      {{btn.label}}
    </el-button>
  </div>
</template>

<script>
import emitter from '@/utils/emitter';

export default {
  name: 'd-action',
  componentName: 'd-action',
  mixins: [emitter],
  props: {
    actions: {
      type: Array,
      default: () => ([])
    }
  },
  data(){
    return {
      searchForm: {},
      isLoading: false,
    }
  },
  methods: {
    handleClick(item) {
      // this.EventBusST.$emit('d-dialog-form-event', 'open')
      console.log(item.eventTarget)
      if(item.eventTarget){
        this.EventBusST.$emit(...item.eventTarget, 123)
      }

    },
  },
  mounted() {
  }
}
</script>

<style scoped>
.global-action-wrap{
  border-top: solid 6px #eee;
  border-bottom: solid 6px #eee;
  padding: 10px;
}
</style>