import { ref, onMounted, watch } from 'vue'

let ind = 0
function fetchUserRepositories(user = ''){
  ind++
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { name: 'A'+ ind, user: user },
        { name: '2' + ind, user: user }
      ])
    }, 500)
  })
}
export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}