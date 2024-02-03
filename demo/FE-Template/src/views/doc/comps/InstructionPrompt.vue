
<template>
  <div class="instruction-prompt">
    <div style="margin-right: 4px">{{title}}</div>
    <div v-for="item in shortcut" :key="item" class="shortcut-item">
      <span>{{shortcutValue(item)}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "InstructionPrompt",
  props: {
    title: String,
    shortcut: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isMac: typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false
    }
  },
  methods: {
    shortcutValue(value) {
      if(value === 'Mod') {
        return this.isMac ? '⌘' : 'Ctrl'
      } else if(value === 'Shift') {
        return '⇧'
      } else if(value === 'Alt') {
        return this.isMac ? '⌥' : 'Alt'
      }
      return value
    }
  },
}
</script>

<style scoped lang="scss">
.instruction-prompt{
  display: flex;
  align-items: center;
  color: #666;
  .shortcut-item{
    box-shadow: 0px 0px 1px 1px rgba(180, 176, 176, 0.4);
    width: 20px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    font-size: 12px;
    justify-content: center;
    border-radius: 2px;
    margin-left: 6px;
    font-weight: bold;
    *{
      transform: scale(0.8);
    }
  }
}
</style>