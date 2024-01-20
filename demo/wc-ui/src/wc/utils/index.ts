export function formatDate(date: string | Date, format: string = ''): string {
  if (!date) return '';

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  function getWeekOfMonth(d: Date): number {
    const dayOfWeek = d.getDay();
    const dayOfMonth = d.getDate();
    return Math.ceil((dayOfMonth + 6 - dayOfWeek) / 7);
  }

  const o: { [key: string]: number } = {
    'M+': date.getMonth() + 1, // 月份
    'W+': getWeekOfMonth(date), // 周
    'D+': date.getDate(), // 日
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds(), // 毫秒
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k].toString()) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }

  return format;
}
