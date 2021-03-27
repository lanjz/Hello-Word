import microMenu from '../../micro/apps'
import menu from '../../router/home'
import { useRouter, useRoute } from 'vue-router'
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
export default {
  setup(){
    const router = useRouter()
    const route = useRoute()
    const defaultActive = route.path.substring(5) || '/'
    function pushRouter(key) {
      console.log(arguments)
      if(typeof key === 'object' && key.activeRule){ // 微应用
        // let { activeRule } = key
        // console.log('router22', router, key.activeRule[activeRule.length-1] === '/' ? key.activeRule:key.activeRule+'/')
        // router.push(key.activeRule[activeRule.length-1] === '/' ? key.activeRule:key.activeRule+'/')
        return
      }
      console.log('key', key)
      const path = '/home'+key
      if(path !== route.path){
        router.push({
          path
        })
      }
    }
    function openMenu(path){
      const isMacroPath = microMenu.find(item => item.activeRule === path)
      if(isMacroPath){ // 目标是微任务路径
        router.push({
          path
        })
      }
    }
    return {
      menuList: menu.children,
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
                      default: () => <el-menu-item index={item.name}>{item.name}</el-menu-item>
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