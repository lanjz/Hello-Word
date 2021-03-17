import store from '../store'
const apps = [
  {
    name: "VueMicroApp",
    entry: "//localhost:8081",
    container: "#frame",
    activeRule: "/vue",
    props:  {
      store //共享主应用的store实例
    }
  },
];

export default apps;