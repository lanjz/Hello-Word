<template>
  <div>
    <div>
      <DemoWrap>
        <div>
          <fin-layer
            style="border: solid 1px red; background: rgba(241, 123, 123, 0.8)"
            v-bind="attr"
          >
            <h1>LAYER 组件内容</h1>
          </fin-layer>
        </div>
        <div style="display: flex">
          <div
            id="layerId1"
            style="
              width: 300px;
              height: 300px;
              border: solid 1px lightseagreen;
              position: relative;
            "
          >
            <h1>layerId1</h1>
          </div>
          <div
            id="layerId2"
            style="
              width: 300px;
              height: 300px;
              border: solid 1px #f1253d;
              position: relative;
            "
          >
            <h1>layerId2</h1>
          </div>
        </div>
        <template #config>
          <CForm v-model="attr" label-width="120px" :column="column"></CForm>
        </template>
      </DemoWrap>
    </div>
    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import md from './laryer.md?raw'
import { getDefaultForm } from '@/utils/index'
const column = [
  {
    render: 'select',
    prop: 'display',
    label: 'display',
    child: [
      { value: 'block', label: 'block' },
      { value: 'inline-block', label: 'inline-block' },
      { value: 'inline', label: 'inline' },
      { value: 'none', label: 'none' },
    ],
  },
  {
    render: 'select',
    prop: 'position',
    label: 'position',
    child: [
      { value: 'absolute', label: 'absolute' },
      { value: 'fixed', label: 'fixed' },
      { value: 'relative', label: 'relative' },
      { value: 'static', label: 'static' },
      { value: 'sticky', label: 'sticky' },
      { value: 'inherit', label: 'inherit' },
      { value: 'initial', label: 'initial' },
    ],
  },
  { render: 'input', prop: 'width', label: 'width' },
  { render: 'input', prop: 'height', label: 'height' },
  { render: 'input', prop: 'left', label: 'left' },
  { render: 'input', prop: 'top', label: 'top' },
  { render: 'input', prop: 'right', label: 'right' },
  { render: 'input', prop: 'bottom', label: 'bottom' },
  { render: 'input', prop: 'z-index', label: 'z-index' },
  {
    render: 'select',
    prop: 'append-to',
    label: '挂载父节点',
    default: '#layerId1',
    child: [
      { value: '', label: '无' },
      { value: 'body', label: 'body' },
      { value: '#layerId1', label: 'layerId1' },
      { value: '#layerId2', label: 'layerId2' },
    ],
  },
]
const attr = ref(getDefaultForm(column))
</script>

<script lang="ts">
export default {
  aliasName: 'Layer',
}
</script>
