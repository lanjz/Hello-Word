<template>
  <el-row class="mb-4">
    <c-button>Default</c-button>
    <c-button type="primary">Primary</c-button>
    <c-button type="warning">Warning</c-button>
    <c-button type="danger">Danger</c-button>
    <c-button type="primary" disabled>Disabled</c-button>

  </el-row>

  <el-row class="mb-4">
    <c-button plain>Plain</c-button>
    <c-button type="primary" plain>Primary</c-button>
    <c-button type="warning" plain>Warning</c-button>
    <c-button type="danger" plain>Danger</c-button>
    <c-button type="primary" disabled plain>Disabled</c-button>
  </el-row>

  <el-row class="mb-4">
    <c-button round>Round</c-button>
    <c-button type="primary" round>Primary</c-button>
    <c-button type="warning" round>Warning</c-button>
    <c-button type="danger" round>Danger</c-button>
    <c-button type="primary" disabled round>Disabled</c-button>
  </el-row>

  <el-row>
    <c-button class="is-icon" :icon="Search" circle />
    <c-button class="is-icon" type="primary" :icon="Edit" circle />
    <c-button class="is-icon" type="warning" :icon="Star" circle />
    <c-button class="is-icon" type="danger" :icon="Delete" circle />
    <c-button class="is-icon" type="primary" :icon="Edit" disabled circle />

  </el-row>
</template>
<script lang="ts" setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.mb-4{
  margin: 20px 0;
}
</style>