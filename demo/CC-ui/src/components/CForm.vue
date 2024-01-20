<template>
  <div>
    <div v-for="item in column" :key="item.prop" class="form-item-wrap">
      <div v-if="item.label" class="c-label" :style="{ width: labelWidth }">
        {{ item.label }}：
      </div>
      <input
        v-if="item.render === 'input'"
        v-model="curModel[item.prop]"
        class="c-input"
        type="text"
      />
      <select
        v-else-if="item.render === 'select'"
        v-model="curModel[item.prop]"
        class="c-select"
      >
        <option v-for="it in item.child" :key="it.value" :value="it.value">
          {{ it.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
const { modelValue } = defineProps<{
  modelValue: object
  column: object[]
  labelWidth: string
}>()
const curModel = ref({})
const emit = defineEmits(['update:modelValue'])
console.log('modelValue', modelValue)
watch(
  () => modelValue,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(curModel.value)) {
      curModel.value = { ...curModel.value, ...val }
    }
  },
  { immediate: true },
)

watch(
  () => curModel,
  (val) => {
    emit('update:modelValue', val.value)
  },
  { deep: true },
)
</script>

<style scoped lang="scss">
.form-item-wrap {
  display: flex;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  .c-label {
    line-height: 35px;
    margin-right: 5px;
  }
}
.c-input,
.c-select {
  width: 200px;
  height: 35px;
  font-size: 15px;
  border: solid 1px #999;
  border-radius: 3px;
  padding: 0 8px;
  &:focus {
    outline: solid 1px $color-primary;
  }
}
</style>
