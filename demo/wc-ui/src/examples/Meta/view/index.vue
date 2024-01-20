<template>
  <div>
    <DemoWrap>
      <fin-view
        style="border: solid 1px red"
      >
        <div style="height: 20px; width: 20px; background: red"></div>
        <div style="height: 20px; width: 20px; background: green"></div>
        <div style="height: 20px; width: 20px; background: green"></div>
        <div style="height: 20px; width: 20px; background: blue"></div>
      </fin-view>
      <template #config>
        <CForm v-model="attr" label-width="140px" :column="column"></CForm>
      </template>
    </DemoWrap>

    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import md from './view.md?raw'
const attr = ref({
  width: '200px',
  height: '200px',
  display: 'block',
})
const column = [
  { render: 'input', prop: 'width', label: '宽度' },
  { render: 'input', prop: 'height', label: '高度' },
  {
    render: 'select',
    prop: 'display',
    label: 'Display',
    child: [
      { value: 'block', label: 'block' },
      { value: 'inline-block', label: 'inline-block' },
      { value: 'flex', label: 'flex' },
    ],
  },
]
</script>
<script lang="ts">
export default {
  aliasName: 'View',
}
</script>

<style scoped></style>
