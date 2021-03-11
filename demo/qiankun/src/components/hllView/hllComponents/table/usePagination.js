import { ref } from 'vue'

export default function usePagination(pagination = {}) {
  const paging = ref({ // 不用 reactive 是因为不方便 forceUpdatePage 调用
    pageSize: pagination.pageSize || 10,
    pageNum: pagination.pageNum || 1,
  })
  function handleCurrentChange (val){
    if(val !== paging.value.pageNum){
      paging.value = {
        ...paging.value,
        pageNum: val
      }
    }
  }
  function handleSizeChange (val){
    if(val !== paging.value.pageSize){
      paging.value = {
        ...paging.value,
        pageSize: val
      }
    }

  }
  function forceUpdatePage(page = paging.value){
    paging.value = {
      ...page
    }
  }
  return {
    paging,
    handleSizeChange,
    handleCurrentChange,
    forceUpdatePage,
  }
}
