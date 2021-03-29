import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import microMenu from '../../micro/apps'
import menu from '../../router/home'
const MenuItem = (item, prefix) => {
  const slots = {
    default: () => <i className="el-icon-menu"></i>,
    title: () => <span>{item.name}</span>
  }
  return (
    <el-menu-item index={prefix+item.path}>
      {slots}
    </el-menu-item>
  )
}
const SubMenu = (item, prefix) => {
  let curPrefix = prefix+item.path
  const slots = {
    title: () => [<i className="el-icon-location"></i>, <span>{item.name}</span>],
    default: () => item.children.map((subItem, subIndex) =>(
      <RenderMenu item={subItem} prefix={ curPrefix+'/'} subIndex={subIndex}></RenderMenu>
    )),
  }
  return (
    <el-submenu index={curPrefix}>
      {slots}
    </el-submenu>
  )
}
function RenderMenu({item, prefix = '/'}){
  return item.children&&item.children.length ? SubMenu(item, prefix) : MenuItem(item, prefix)
}
// 判断当前路径是微应用路径
function isMicroPath(path){
  let match = path.split('/')
  if(match && match[1]){
    return microMenu.find(item => item.activeRule === '/'+match[1])
  }
  return false
}
function getSubPath(path){
  if(isMicroPath(path)){  // 目标是微任务路径
    return path
  }
  return path.substring(5) || '/'
}
export default {
  setup(){
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const defaultActive = ref(getSubPath(route.path))
    onBeforeRouteUpdate((to) => {
      console.log('onBeforeRouteUpdate')
      defaultActive.value = getSubPath(to.path)
    });
    function pushRouter(key) {
      if(isMicroPath(key)){ // 目标是微任务路径
        router.push({
          path: key
        })
        return
      }
      const path = '/home'+key
      if(path !== route.path){
        router.push({
          path
        })
      }
    }
    function openMenu(path){
      if(isMicroPath(path) && window.location.pathname.indexOf(path) !== 0){ // 目标是微任务路径
        router.push({
          path
        })
      }
    }
    return {
      menuList: menu.children,
      microMenuList: store.state.global.microMenu,
      defaultActive,
      pushRouter,
      openMenu
    }
  },
  render(){
    const menuAttrs = {
      style: "border-right: none",
      uniqueOpened: true,
      'default-active': this.defaultActive,
      'background-color':"#001529",
      'text-color':"#c0c4cc",
      'active-text-color':"#fff",
    }
    return (
      <div className="app-menu-warp">
        <el-menu{...menuAttrs} onSelect={this.pushRouter} onOpen={this.openMenu}>
          {
            this.menuList.map((item, index) => <RenderMenu item={item} key={index}></RenderMenu>)
          }
          {
            microMenu && microMenu.length &&
            <el-menu-item-group title="微应用">
              {{
                title: () => <div>分组一</div>
              }}
              {
                microMenu.map(item => (
                  <el-submenu index={item.activeRule}>
                    {{
                      title: () => <div>{item.name}</div>,
                      default: () => {
                        return (this.microMenuList[item.activeRule]||[]).map(i => <el-menu-item index={i.path}>{i.name}</el-menu-item>)
                      }
                    }}
                  </el-submenu>
                ))
              }
            </el-menu-item-group>
            
          }
      </el-menu>
      </div>
    )
  }
}