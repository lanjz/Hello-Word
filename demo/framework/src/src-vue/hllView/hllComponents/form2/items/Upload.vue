<template>
  <HllUpload v-model="formData[key]" v-bind="attrs"></HllUpload>
</template>

<script>
import formItemMinxin from './formItemMinxin';
import HllUpload from '../../upload/HllUpload'
export default {
  name: 'HllInput',
  mixins: [formItemMinxin],
  components: {
    HllUpload,
  },
}
</script>

<style scoped>

</style>
