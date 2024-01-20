<template>
  <div>
    <DemoWrap>
      <fin-flex v-bind="attr" style="border: solid 1px red">
        <div style="height: 20px; width: 20px; background: red"></div>
        <div style="height: 20px; width: 20px; background: green"></div>
        <div style="height: 20px; width: 20px; background: green"></div>
        <div style="height: 20px; width: 20px; background: blue"></div>
      </fin-flex>
      <template #config>
        <CForm v-model="attr" label-width="140px" :column="column"></CForm>
      </template>
    </DemoWrap>

    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import md from './flex.md?raw'
const attr = ref({
  'align-items': 'center',
  'justify-content': 'space-around',
  width: '200px',
  height: '200px',
})
const column = [
  { render: 'input', prop: 'width', label: '宽度' },
  { render: 'input', prop: 'height', label: '高度' },
  {
    render: 'select',
    prop: 'align-items',
    label: 'align-items',
    child: [
      { value: 'flex-start', label: 'flex-start' },
      { value: 'flex-end', label: 'flex-end' },
      { value: 'center', label: 'center' },
      { value: 'baseline', label: 'baseline' },
      { value: 'stretch', label: 'stretch' },
    ],
  },
  {
    render: 'select',
    prop: 'justify-content',
    label: 'justify-content',
    child: [
      { value: 'flex-start', label: 'flex-start' },
      { value: 'flex-end', label: 'flex-end' },
      { value: 'center', label: 'center' },
      { value: 'space-between', label: 'space-between' },
      { value: 'space-evenly', label: 'space-evenly' },
      { value: 'space-around', label: 'space-around' },
      { value: 'initial', label: 'initial' },
      { value: 'inherit', label: 'inherit' },
    ],
  },
]
</script>
<script lang="ts">
export default {
  aliasName: 'Flex',
}
</script>

<style scoped></style>
