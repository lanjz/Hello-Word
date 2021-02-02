export default {
  props: ['formItemData', 'formData'],
  componentAlias: 'HllFormItem',
  components: {
    render: {
      props: {
        render: Function,
      },
      render (h) {
        return this.render&&this.render(h)
      }
    }
  },
  data(){
    return {
      key: '',
      attrs: {},
    }
  },
  watch: {
    formItemData: {
      handler: function (value){
        const { model, formType, slot,...attrs } = value
        this.key = model
        this.attrs = attrs
        this.formType = formType
      },
      deep: true,
      immediate: true
    },
  },
}
