<template>
  <div class="global-container-wrap global-flex-column">
    <render
        v-for="(item, index) in meta"
        :meta=item
        :key="index"
    />
  </div>
</template>

<script>
import render from './Render'
import meta from './meta'
console.log('meta', meta)
export default {
  name: 'dynamic',
  components: { render },
  data(){
    return {
      meta
    }
  }
}
</script>

<style scoped>

</style>