<template>
  <div>
    <div>
      <DemoWrap>
        <h3 @click="changeOpt">双向绑定: {{ name }}</h3>
        <h3>Option形式</h3>
        <div>
          <fin-select
            v-bind="attr"
            v-fin="name"
            disabled
            @update="blur"
            @focus="focus"
            @clear="clear"
            :options="option"
          >
          </fin-select>
        </div>
        <h3>插槽形式</h3>
        <div>
          <fin-select
            v-bind="attr"
            v-fin="name"
            @update="blur"
            clearable
            filterable
            :collapse-tags="false"
            placeholder="placeholderplaceholderplaceholderplaceholderplaceholderplaceholder"
            @focus="focus"
            @clear="clear"
          >
            <fin-option v-for="item in option" :value="item.value" :label="item.label">
              <div>{{item.label}}</div>
            </fin-option>
          </fin-select>
        </div>
        <template #config>
        </template>
      </DemoWrap>
    </div>
    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getDefaultForm } from '@/utils/index.ts'
import md from './readme.md?raw'


const option = ref([
  { label: 'Option1', value: 'Value1' },
  { label: 'Option2', value: 'Value2' },
  { label: 'Option3', value: 'Value3' },
  { label: 'Option4', value: 'Value4' },
])
const changeOpt = (e) => {
  console.log('e', e)
  setTimeout(() => {
    option.value = [
      { label: 'Option3', value: 'Value3' },
      { label: 'Option5', value: 'Value5' },
    ]
  }, 1000)
}
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
const name = ref(['Value4'])
const attr = ref(getDefaultForm(column))
watch(name, (val, old) => {
  console.log('name', val, old)
})
setTimeout(() => {
  name.value = ['Value3']
}, 1000)

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
  aliasName: 'Select',
}
</script>

<!--
<script>
import { getDefaultForm } from '@/utils/index.ts'
import md from './readme.md?raw'
export default {
  aliasName: 'Select',
  data() {
    return {
      md,
      name: ['Value3'],
      option: [
        { label: 'Option1', value: 'Value1' },
        { label: 'Option2', value: 'Value2' },
        { label: 'Option3', value: 'Value3' },
        { label: 'Option4', value: 'Value4' },
      ]
    }
  }
}
</script>
-->
