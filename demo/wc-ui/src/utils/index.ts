export function litName(name: string) {
  return `fin-${name}`
}
export function isUN(val: any) {
  return val === null || val === undefined || val === ''
}

export function getValidProperties(
  data: Record<string, any>,
): Record<string, any> {
  const res: Record<string, any> = {}
  Object.keys(data).forEach((item) => {
    if (isUN(data[item])) {
      return
    }
    res[item] = data[item]
  })
  return res
}

export function convertToInlineStyles(
  sty: Record<string, string> | undefined | string = {},
): string {
  if (typeof sty === 'string') {
    return sty
  }
  const valid = getValidProperties(sty)
  let inlineStyles = ''
  for (const key in valid) {
    if (Object.hasOwnProperty.call(valid, key)) {
      inlineStyles += `${key}:${valid[key]};`
    }
  }
  return inlineStyles
}

interface ColumnItem {
  prop: string
  default?: any
}

export function getDefaultForm(column: ColumnItem[]): Record<string, any> {
  const res: Record<string, any> = {}
  column.forEach((item) => {
    const { prop } = item
    if (item.default) {
      res[prop] = item.default
    }
  })
  return res
}

export function findFinSelectNode(element: HTMLElement, tagName: string) {
  let currentElement = element
  let depth = 0

  while (currentElement && depth < 10) {
    if (currentElement.tagName === tagName.toUpperCase()) {
      return currentElement
    }
    currentElement = currentElement.parentNode
    depth++
  }
}
export function findTargetDelegation(event: Event, target) {
  // 获取实际触发事件的元素
  let targetElement = event.target
  const bindEventElement = event.currentTarget
  // 判断是否为 'fin-option' 标签或其子节点，并且是否具有 bindName 属性
  while (targetElement && !targetElement.matches(target)) {
    // 添加额外条件判断，检查当前遍历到的元素是否是绑定事件的元素
    if (targetElement === bindEventElement) {
      break
    }

    targetElement = targetElement.parentElement
  }
  // 判断是否找到符合条件的 'fin-option' 标签
  if (targetElement) {
    return targetElement
  }
  return null
}

export function formatDate(date, format) {
  if(!date) return ''
  if(!format) {
    return new Date(date);
  }
  date = new Date(date)
  function getWeekOfMonth(d){
    const date = new Date(d)
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + 6 - dayOfWeek) / 7)
  }
  const o = {
    'M+': date.getMonth() + 1, //月份
    'W+': getWeekOfMonth(date), //周
    'D+': date.getDate(), //日
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(format)){
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return format;
}
