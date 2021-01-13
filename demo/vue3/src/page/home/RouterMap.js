import { computed } from 'vue'
import { useRoute } from 'vue-router'
import './home.scss'
export default {
  setup(){
    const route = useRoute()
    const routerMap = computed(() => {
      const { matched } = route
      let arr = []
      matched.forEach((item, index) => {
        if(index === 0) return
        arr.push(item)
      })
      return arr
    })
    return {
      routerMap
    }
  },
  render(){
    return (
      <div className="router-map flex align-center">
        <i className="el-icon-guide router-map-first-icon"></i>
        {
          this.routerMap.map((item, index) => {
            return (
              <span>
                {index > 0 && <i className="el-icon-arrow-right router-map-icon"></i>}<span className="text">{item.name}</span>
              </span>
            )
          })
        }
      </div>
    )
  }
}