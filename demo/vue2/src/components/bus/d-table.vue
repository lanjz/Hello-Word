<template>
  <div class="global-page-main-wrap global-flex-1" style="padding: 10px">
    <CTable
        ref="tableRef"
        :columns="tableConfig"
        method="post"
        fullHeight
        :url="tableUrl"
    />
  </div>
</template>

<script>
import emitter from '@/utils/emitter'
export default {
  name: 'd-table',
  componentName: 'd-table',
  mixins: [emitter],
  props: {
    tableConfig: {
      type: Array,
      default: () => ([])
    },
    tableUrl: String
  },
  data(){
    return {
      searchForm: {},
      isLoading: false,
    }
  },
  methods: {
    onSearch(data) {
      alert(JSON.stringify(data))
      this.$refs.tableRef.reFetchData();
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>