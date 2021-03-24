import NProgress from "nprogress";
import "nprogress/nprogress.css";
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start,
  initGlobalState
} from "../../qian/index";

// 微应用注册信息
import apps from "./apps";
import store from '../store'
console.log('store', store)
/**
 * 注册微应用
 * 第一个参数 - 微应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(apps, {
  // qiankun 生命周期钩子 - 微应用加载前
  beforeLoad: (app) => {
    // 加载微应用前，加载进度条
    NProgress.start();
    console.log("before load", app.name);
    return Promise.resolve();
  },
  // qiankun 生命周期钩子 - 微应用挂载后
  afterMount: (app) => {
    // 加载微应用前，进度条加载完成
    NProgress.done();
    console.log("after mount", app.name);
    return Promise.resolve();
  },
});

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event) => {
  console.error(event);
  const { msg } = event
  // 加载失败时提示
  if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
    this.$message.error('微应用加载失败，请检查应用是否可运行');
  }
});

// 设置通信
const state = {
  baseStore: store.state,
  commit: store.commit,
  dispatch: store.dispatch
}
export const actions = initGlobalState(state);
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('主应用onGlobalStateChange', state, prev);
});
// actions.setGlobalState(state);
actions.offGlobalStateChange();
store.subscribe((mutation, state) => {
  console.log('state', state)
  actions.setGlobalState({
    baseStore: store.state,
    commit: store.commit,
    dispatch: store.dispatch
  });
})

// 导出 qiankun 的启动函数
export default start;