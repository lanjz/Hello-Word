<template>
  <div>
    <DemoWrap>
      <fin-img
        :src="imgSrc"
        v-bind="attr"
        @load="loadImg"
        @error="errorImg"
        @click="change"
      />
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

const src1 =
  'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'
const src2 =
  'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80'
let imgSrc = ref(src1)
let tag = true
const change = () => {
  imgSrc.value = tag ? src2 : src1
  tag = !tag
}
const attr = ref({
  fit: 'fill',
  alt: '',
  width: '200px',
  height: '200px',
})
const column = [
  { render: 'input', prop: 'width', label: '宽度' },
  { render: 'input', prop: 'height', label: '高度' },
  { render: 'input', prop: 'alt', label: '图片描述' },
  { render: 'input', prop: 'border-radius', label: '圆角' },
  {
    render: 'select',
    prop: 'fit',
    label: '填充模式',
    child: [
      { value: 'fill', label: 'fill' },
      { value: 'contain', label: 'contain' },
      { value: 'cover', label: 'cover' },
      { value: 'none', label: 'none' },
      { value: 'scale-down', label: 'scale-down' },
    ],
  },
]
const loadImg = (e) => {
  console.log('loadImg', e)
}
const errorImg = (e) => {
  console.log('errorImg', e)
}
function defaultImg() {
  let img = document.createElement('img')
  img.src = src1
  img.onerror = function (e) {
    console.log('eeeeeeeerr3333', e)
  } //防止闪图
}
defaultImg()
</script>
<script lang="ts">
export default {
  aliasName: 'Img',
}
</script>

<style scoped></style>
