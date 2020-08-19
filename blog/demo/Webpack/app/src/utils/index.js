import Vue from 'vue'
export const EventBus = new Vue()
var obj = 1
export default obj
export function add() {
  obj = obj + 1
}