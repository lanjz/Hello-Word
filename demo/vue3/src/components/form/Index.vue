<template>
<div>
  <HllForm
      :formConfig="forConfig"
      v-model="formDate"
  ></HllForm>
  <Test
      v-model="formDate"
  ></Test>
</div>
</template>

<script>
import HllForm from '../../components/hllView/hllComponents/form/Form'
import { formConfig } from './createFormConfig'
import Test from './test'
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
    Test
  },
  watch: {
    formDate: {
      handler: function(){
        console.log('watcg', this.formDate)
      },
      deep: true,
      immediate: true
    },
    age: function (){
      console.log('age', this.age)
    }
  },
  computed: {
    forConfig(){
      return formConfig.call(this)
    }
  },
  mounted() {
    console.log('---', this)
  }
}
</script>

<style scoped>

</style>