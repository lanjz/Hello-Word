<template>
  <div class="global-search-box" style="padding: 10px">
    <c-form
        inline
        class="search-form"
        :model="searchForm"
        :column="searchFormConfig"
        :loading="isLoading"
        @confirm="onSearch"
        @reset="resetSearch"
    />
  </div>
</template>

<script>
import emitter from '@/utils/emitter';

export default {
  name: 'd-search',
  componentName: 'd-search',
  mixins: [emitter],
  props: {
    searchFormConfig: {
      type: Array,
      default: () => ([])
    },
    eventTarget: {}
  },
  data(){
    return {
      searchForm: {},
      isLoading: false,
    }
  },
  methods: {
    getDefaultProperty(data) {
      let res = {};
      data.forEach((item) => {
        res[item.prop] = '';
      });
      return res;
    },
    onSearch(){
      if(this.eventTarget){
        this.EventBusST.$emit(...this.eventTarget, this.searchForm)
      }
    },
    resetSearch(){
      this.initSearchForm()
    },
    initSearchForm(){
      this.searchForm = { ...this.getDefaultProperty(this.searchFormConfig) }
    }
  },
  mounted() {
    this.initSearchForm()
  }
}
</script>

<style scoped>

</style>