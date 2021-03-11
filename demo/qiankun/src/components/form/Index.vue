<template>
<div>
  <HllForm
      ref="curFrom"
      :formConfig="forConfig"
      v-model="formDate"
      label-width="80px"
      inline
  ></HllForm>
</div>
</template>

<script>
import HllForm from '../../components/hllView/hllComponents/form/Form'
import { formConfig } from './createFormConfig'
export default {
  name: "Index",
  data(){
    return {
      formDate: {
        name: 'lan'
      },
      age: 1
    }
  },
  components: {
    HllForm,
  },
  watch: {
    formDate: {
      handler: function(){
        console.log('watcg', this.formDate)
      },
      deep: true,
    },
    age: function (){
      console.log('age', this.age)
    }
  },
  computed: {
    forConfig(){
      return formConfig.call(this)
    },
  },
  methods: {
    validform(){
      console.log('this.$refs[\'curFrom\']', this.$refs['curFrom'])
      this.$refs['curFrom'].validate()
      .then(res => {
        console.log('res', res)
      })
    }
  },
  mounted() {
    console.log('---', this)
  }
}
</script>

<style scoped>

</style>