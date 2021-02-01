function getDefaultValue(type){
  return ['checkbox'].includes(type) ? [] : ''
}
export default {
  props: ['formItemData', 'value', 'formData'],
  componentAlias: 'HllFormItem',
  data(){
    return {
      key: '',
      attrs: {},
    }
  },
  watch: {
    formItemData: {
      handler: function (value){
        const { model, type, slot,...attrs } = value
        this.key = model
        this.attrs = attrs
        this.type = type
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    validate(){
      return new Promise(resolve => {
        this.$refs['modelData'].validate((valid, message) => {
          if(!valid&&message&&message.name){
            message.name = message.name.map(item => {
              item['field'] = this.key
              return item
            })
          }
          resolve({ valid, message, key: this.key, data: this.getData() })
        });
      })
    },
    getData(){
      return {
        [this.key]: this.modelData.name
      }
    },
    resetFields() {
      this.$refs['modelData'].resetFields();
    }
  }
}
