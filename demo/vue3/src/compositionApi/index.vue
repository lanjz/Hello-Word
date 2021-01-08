<template>
  <div>
    <RepositoriesFilters v-model="name"></RepositoriesFilters>
    <RepositoriesSortBy :repositories="repositories"></RepositoriesSortBy>
    <RepositoriesList :repositories="repositories"></RepositoriesList>
  </div>
</template>

<script>
import useUserRepositories from './useUserRepositories'
import useRepositoryNameSearch from './useRepositoryNameSearch'
// import useRepositoryFilters from './useRepositoryFilters'
import { toRefs } from 'vue'
import RepositoriesFilters from './RepositoriesFilters'
import RepositoriesSortBy from './RepositoriesSortBy'
import RepositoriesList from './RepositoriesList'
export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  setup (props) {
    const { user } = toRefs(props)
    const { repositories, getUserRepositories } = useUserRepositories(user)
    const {
      searchQuery,
      // repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)
/*    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)*/
    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories,
      getUserRepositories,
      searchQuery,
      // filters,
      // updateFilters
    }
  },
  data () {
    return {
      name: ''
    }
  },
  watch: {
    name(val){
      this.getUserRepositories(val)

    }
  },
  computed: {},
  methods: {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
