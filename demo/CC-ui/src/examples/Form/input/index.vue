<template>
  <div>
    <div>
      <DemoWrap>
        <h3>双向绑定: {{ name }}</h3>
        外层：
        <input v-model="name" type="text" />
        <div>
          <fin-input
            v-bind="attr"
            :value="name"
            @input="emitInput"
            @blur="blur"
            @focus="focus"
            @change="change"
            @clear="clear"
          >
          </fin-input>
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
import md from './input.md?raw'
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
const name = ref('默认值来一个')
const attr = ref(getDefaultForm(column))
const emitInput = (e: CustomEvent) => {
  name.value = e.detail
}
const formatter = (data: string) => {
  console.log('data')
  return data + '-formatter'
}
const clear = (data: any) => {
  console.log('clear', data)
}
const change = (data: any) => {
  console.log('change', data)
}
const focus = (data: any) => {
  console.log('focus', data)
}
const blur = (data: any) => {
  console.log('blur', data)
}
</script>
<script lang="ts">
export default {
  aliasName: 'Input',
}
</script>
