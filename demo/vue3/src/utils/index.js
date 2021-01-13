function arrToObjWalk(obj, data, key, child, parent = null){
  data.forEach(item => {
    obj[item[key]] = {
      ...item,
      parent,
    }
    if(item[child] && item[child].length){
      arrToObjWalk(obj, item[child], key, child, item)
    }
  })
}
/**
 * 将对象数组转为扁平对象
 * @params {Array||Object} data
 * @params {key} 使用的 key 名
 * @params {child} 子元素键名
 * */
export function arrToObj(data = [], key, child){
  let obj = {}
  const type = Object.prototype.toString.call(data)
  if(type === '[object Object]'){
    data = [data]
  }
  arrToObjWalk(obj, data, key, child)
  return obj
}
export function add0(m){ return m < 10 ? '0' + m : m }
export function formatDate(time) {
  if(!time) return
  time = new Date(time);
  let y = time.getFullYear();
  let m = time.getMonth()+1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  // var s = time.getSeconds();
  // return y + '-' + add0(m) + '-'+add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
  return y + '-' + add0(m) + '-'+add0(d) + ' ' + add0(h) + ':' + add0(mm)
}