import store from '../store'
const apps = [
  {
    name: "VueMicroApp",
    entry: "//localhost:8081",
    container: "#frame",
    activeRule: "/vue",
  },
  {
    name: "ReactMicroApp",
    entry: "//localhost:3000/",
    container: "#frame",
    activeRule: "/react",
  },
];

export default apps;