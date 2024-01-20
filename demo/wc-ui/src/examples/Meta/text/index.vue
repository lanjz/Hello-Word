<template>
  <div>
    <DemoWrap>
      <fin-text v-bind="attr" :sty="styles">
        地顶替针脚锊无可奈何花落去 福达坊鞯震城地顶替针脚锊无可奈何花落去
        福达坊鞯震城地顶替针脚锊无可奈何花落去
        福达坊鞯震城地顶替针脚锊无可奈何花落去
        福达坊鞯震城地顶替针脚锊无可奈何花落去 福达坊鞯震城
      </fin-text>
      <template #config>
        <CForm v-model="attr" label-width="140px" :column="column"></CForm>
      </template>
    </DemoWrap>

    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import md from './readme.md?raw'

const attr = ref({
  clamp: 2,
  color: '',
  'font-size': '',
})
const styles = ref({
  'font-weight': 'bold',
})
const column = [
  { render: 'input', prop: 'clamp', label: '截断行数' },
  { render: 'input', prop: 'color', label: '颜色' },
  { render: 'input', prop: 'font-size', label: '字体大小' },
]
</script>
<script lang="ts">
export default {
  aliasName: '文本',
}
</script>

<style scoped></style>
