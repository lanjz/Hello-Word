<template>
  <div>
    <div>
      <DemoWrap>
        <h3 @click="changeOpt">双向绑定: {{curData }}</h3>
        <div>
          <fin-date-panel :value="curData" />
        </div>
        <div>
          <fin-year-panel :value="curData" />
        </div>
        <div>
          <fin-month-panel :value="curData" />
        </div>
        <div>
          <fin-date-panel :value="curData" type="week" />
        </div>
        <template #config>
          <CForm v-model="attr" label-width="120px" :column="column" />
        </template>
      </DemoWrap>
    </div>
    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getDefaultForm } from '@/utils/index.ts'
import md from './readme.md?raw'

const curData = ref(new Date('2024-2-17'))
const column = [
  {
    render: 'select',
    prop: 'type',
    label: '类型',
    default: 'text',
    child: [
      { value: 'text', label: '文本' },
      { value: 'password', label: '密码' },
      { value: 'textarea', label: '多行文本' },
    ],
  },
  {
    render: 'select',
    prop: 'disabled',
    label: '是否禁用',
    default: false,
    child: [
      { value: true, label: 'true' },
      { value: false, label: 'false' },
    ],
  },
  {
    render: 'select',
    prop: 'show-word-limit',
    label: '显示输入数量',
    child: [
      { value: true, label: 'true' },
      { value: false, label: 'false' },
    ],
  },
  {
    render: 'select',
    prop: 'clearable',
    label: '是否可以清除',
    default: false,
    child: [
      { value: true, label: 'true' },
      { value: false, label: 'false' },
    ],
  },
  {
    render: 'input',
    prop: 'maxlength',
    label: '最大长度',
  },
]
const attr = ref(getDefaultForm(column))
</script>
<script lang="ts">
export default {
  aliasName: 'Date-Panel',
}
</script>
