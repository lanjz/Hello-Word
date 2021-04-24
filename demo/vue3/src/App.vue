<template>
  <router-view></router-view>
</template>
<script>
export default {
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  }
}
</script>