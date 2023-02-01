<template>
  <div >
    <p>{{ el.name }}</p>
    <nested-draggable :tasks="el.tasks" />
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'nested-draggable',
  props: {
    tasks: {
      required: true,
      type: Array
    }
  },
  components: {
    draggable
  }

}
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
