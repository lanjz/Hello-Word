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
      const path = '/home'+key
      if(path !== route.path){
        router.push({
          path
        })
      }
    }
    return {
      menuList: menu.children,
      defaultActive,
      pushRouter
    }
  },
  render(){
    const menuAttrs = {
      style: "border-right: none",
      uniqueOpened: "true",
      'default-active': this.defaultActive,
      'background-color':"#001529",
      'text-color':"#c0c4cc",
      'active-text-color':"#fff",
    }
    return (
      <el-menu{...menuAttrs} onSelect={this.pushRouter}>
        {
          this.menuList.map((item, index) => <RenderMenu item={item} key={index}></RenderMenu>)
        }
      </el-menu>
    )
  }
}