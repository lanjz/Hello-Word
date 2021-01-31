function getDefaultValue(type){
  return ['checkbox'].includes(type) ? [] : ''
}
export default {
  props: ['formItemData', 'formAttrs', 'value', 'formData'],
  componentAlias: 'HllFormItem',
  data(){
    return {
      modelData: {
        name: getDefaultValue(this.formItemData.type)
      },
      key: '',
      attrs: {},
      rules: {
        name: []
      }
    }
  },
  watch: {
    formItemData: {
      handler: function (value){
        const { model, type, rules, slot,...attrs } = value
        this.key = model
        this.attrs = attrs
        this.type = type
        this.rules.name = rules || []
      },
      deep: true,
      immediate: true
    },
    'modelData.name': function (val){
      this.$emit('input', val)
    },
    value: {
      handler: function (val){
        this.modelData.name = typeof val === 'undefined' ? getDefaultValue(this.formItemData.type) : val
      },
      deep: true,
      immediate: true
    }
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
