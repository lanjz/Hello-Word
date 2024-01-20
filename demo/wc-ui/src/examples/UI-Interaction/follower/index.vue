<template>
  <div>
    <div>
      <DemoWrap>
        <div>
          <div @click="show=!show" style="border: solid; padding: 10px 20px;width: 300px">跟着我</div>
          <fin-follower v-if="show">
            <div style="width: 200px; height: 300px; background: red"></div>
          </fin-follower>
        </div>
        <template #config>
        </template>
      </DemoWrap>
    </div>
    <MdDoc :md="md"></MdDoc>
  </div>
</template>

<script setup lang="ts">
import md from './readme.md?raw'
const show = ref(true)

</script>
<script lang="ts">
export default {
  aliasName: '跟随者',
}
</script>
