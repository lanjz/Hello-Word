<template>
  <DemoWrap>
    <h3>双向绑定</h3>
    外层：
    <input v-model="name" type="text" />
    <simple-greeting :name="name" @my-input="emitInput"></simple-greeting>
  </DemoWrap>
</template>
<script lang="ts">
export default {
  aliasName: '一颗粟子',
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('默认值来一个')
const emitInput = (e) => {
  name.value = e.detail
}
</script>

<style scoped></style>
