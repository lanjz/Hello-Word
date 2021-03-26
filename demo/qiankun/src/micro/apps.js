import store from '../store'
const apps = [
  {
    name: "VueMicroApp",
    entry: "//localhost:8081",
    // entry: " //localhost:5000  ",
    container: "#frame",
    activeRule: "/vue",
  },
  {
    name: "VueMicroApp2",
    entry: " //localhost:5000",
    container: "#frame",
    activeRule: "/abc",
  },
/*  {
    name: "ReactMicroApp",
    entry: "//localhost:3000/",
    container: "#frame",
    activeRule: "/react",
  },*/
];

export default apps;