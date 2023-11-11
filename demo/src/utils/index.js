/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @summary Parse the time to string
 * @param   {(Object|string|number)} time
 * @param   {string} cFormat
 * @return  {string | null}
 */
export function parseTime(time, cFormat) {
	if (!time) return '';
	if (arguments.length === 0) {
		return null;
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
	let date;
	if (typeof time === 'object') {
		date = time;
	} else {
		if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
			time = parseInt(time);
		}
		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
	};
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value];
		}
		return value.toString().padStart(2, '0');
	});
	return time_str;
}

/**
 * @param  {number} time
 * @param  {string} option
 * @return {string}
 */
export function formatTime(time, option) {
	if (('' + time).length === 10) {
		time = parseInt(time) * 1000;
	} else if (/^[0-9]*$/.test(time)) {
		time = +time;
	}
	const d = new Date(time);
	const now = Date.now();

	const diff = (now - d) / 1000;

	if (diff < 30) {
		return '刚刚';
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + '分钟前';
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前';
	} else if (diff < 3600 * 24 * 2) {
		return '1天前';
	}
	if (option) {
		return parseTime(time, option);
	} else {
		return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
	}
}

/**
 * @param  {string} url
 * @return {Object}
 */
export function getQueryObject(url) {
	url = url == null ? window.location.href : url;
	const search = url.substring(url.lastIndexOf('?') + 1);
	const obj = {};
	const reg = /([^?&=]+)=([^?&=]*)/g;
	search.replace(reg, (rs, $1, $2) => {
		const name = decodeURIComponent($1);
		let val = decodeURIComponent($2);
		val = String(val);
		obj[name] = val;
		return rs;
	});
	return obj;
}

/**
 * @param  {Array} actual
 * @return {Array}
 */
export function cleanArray(actual) {
	const newArray = [];
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i]);
		}
	}
	return newArray;
}

/**
 * @param {Object} json
 * @return {Array}
 */
export function param(json) {
	if (!json) return '';
	return cleanArray(
		Object.keys(json).map((key) => {
			if (json[key] === undefined) return '';
			return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
		})
	).join('&');
}

/**
 * @param {string} type
 * @return {Date}
 */
export function getTime(type) {
	if (type === 'start') {
		return new Date().getTime() - 3600 * 1000 * 24 * 90;
	} else {
		return new Date(new Date().toDateString());
	}
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @return {Object}
 */
export function deepClone(source) {
	if (!source && typeof source !== 'object') {
		throw new Error('error arguments', 'deepClone');
	}
	const result = Array.isArray(source) ? [] : {};
	for (const key in source) {
		if (typeof source[key] === 'object' && source[key] !== null) {
			result[key] = deepClone(source[key]);
		} else {
			result[key] = source[key];
		}
	}
	return result;
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @return {boolean}
 */
export function hasClass(ele, cls) {
	return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
	if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
	if (hasClass(ele, cls)) {
		const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		ele.className = ele.className.replace(reg, ' ');
	}
}

/**
 * @summary 下载 excel 文件
 * @param   { stream } data 数据流
 * @param   { fileName } 导出后的文件名
 * @return  { void }
 * */
export function downloadFormStream(res, fileName = '') {
	const { data, headers } = res;
	if (headers['content-disposition']) {
		fileName = decodeURI(
			res.headers['content-disposition'].split(`filename=`)[1] //此处根据实际返回下载文件名称分割
		);
	}
	let getDot = fileName.lastIndexOf('.');
	let suffix = getDot > -1 ? fileName.substring(getDot + 1) : 'xlsx';
	let typeMap = {
		xls: 'application/vnd.ms-excel;charset=utf-8',
		xlsx: 'application/vnd.ms-excel;charset=utf-8',
	};
	let blob = new Blob([data], {
		type: typeMap[suffix],
	});
	if ('msSaveOrOpenBlob' in navigator) {
		//兼容ie浏览器
		window.navigator.msSaveOrOpenBlob(blob, fileName); //ie下手动添加后缀名
	} else {
		let downloadElement = document.createElement('a');
		let href = window.URL.createObjectURL(blob); //创建下载的链接
		downloadElement.href = href;
		downloadElement.download = fileName; //下载后文件名
		document.body.appendChild(downloadElement);
		downloadElement.click(); //点击下载
		document.body.removeChild(downloadElement); //下载完成移除元素
		window.URL.revokeObjectURL(href); //释放掉blob对象
	}
}

/**
 * @summary 将对象转为数组
 * @param   { object } obj
 * @param   { isNumber } key 是否将 key 强制转换成 number，对象的 key 遍历出来是 string 类型
 * @param   { string } keyName 对象 key 放在哪个属性
 * @param   { valueName } valueName 对象 value 放在哪个属性
 * @return  { array }
 * */
export function enumToList(obj, isNumKey, keyName = 'code', valueName = 'desc') {
	let arr = [];
	Object.keys(obj).forEach((item) => {
		if (isNumKey) {
			item = +item;
		}
		arr.push({ [keyName]: item, [valueName]: obj[item] });
	});
	return arr;
}

/**
 * @summary 将数组转为对象
 * @param   { array } arr
 * @param   { string } keyName 使用哪个属性名当做 key
 * @param   { valueName } valueName 使用哪个属性当做 value
 * @return  { object }
 * */
export function listToEnum(arr, keyName = 'value', valueName = 'label') {
	let res = {};
	arr.forEach((item) => {
		res[item[keyName]] = item[valueName];
	});
	return res;
}
export function listToEnumObj(arr, keyName = 'value') {
	let res = {};
	arr.forEach((item) => {
		res[item[keyName]] = item;
	});
	return res;
}
/**
 * @summary 将数组转为对象
 * @param   { array } arr
 * @param   { string } keyName 使用哪个属性名当做 key
 * @param   { valueName } valueName 使用哪个属性当做 value
 * @return  { object }
 * */
export function listToObjEnum(arr, keyName = 'value') {
	let res = {};
	arr.forEach((item) => {
		res[item[keyName]] = item;
	});
	return res;
}
export function getUrlParams(objName) {
	var data = window.location.href;
	if (data.indexOf('?') < 0) return undefined; //判断是否存在参数
	var allParamsArr = data.split('?')[1].split('&'),
		returnObj = {};
	if (allParamsArr.length == 0) return undefined;
	for (var i = 0; i < allParamsArr.length; i++) {
		returnObj[`${allParamsArr[i].split('=')[0]}`] = allParamsArr[i].split('=')[1];
	}
	return returnObj[`${objName}`];
}

export function getDefaultProperty(data) {
	let res = {};
	data.forEach((item) => {
		res[item.prop] = '';
	});
	return res;
}

export function toFormData(data = {}) {
	let formData = new FormData();
	for (let key of Object.keys(data)) {
		const value = data[key];
		if (Array.isArray(value)) {
			for (let k of value) {
				formData.append(key, k);
			}
		} else if (Object.prototype.toString.call(value) === '[object Object]') {
			Object.keys(value).forEach((item) => {
				formData.append(`${key}.${item}`, value[item]);
			});
		} else {
			formData.append(key, value);
		}
	}
	return formData;
}

/**
 * @summary 获取后几天的日期
 * */
export function getAfterDay(date, target = 1, cFormat) {
	let today = new Date(date);
	const targetMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * target;
	const newDay = new Date();
	newDay.setTime(targetMilliseconds);
	return parseTime(newDay, cFormat);
}
/**
 * @summary 获取两个日期之间几个非工作日
 * */
export function weekendBetween(bd, ed) {
	var d1 = new Date(bd),
		d2 = new Date(ed);
	var dateSpan = d2 - d1;
	var days = parseInt(dateSpan / (24 * 3600 * 1000)) + 1; //计算两个日期间的天数差，加1是为了把起始日期计算在内
	var weeks = parseInt(days / 7, 10);
	var result = weeks * 2;
	if (days % 7 > 0) {
		var leftdays = days % 7;
		var week1 = d1.getDay(); //周日=0，周一=1，依次。。
		if (week1 == 0) {
			//如果第一个日期从周日开始，剩余天数不足一周（7天）
			result += 1;
		} else if (week1 + leftdays > 7) {
			//如果第一个日期从周一到周六，加上剩余天数大于7，表示包含周六和周日，所以有两天
			result += 2;
		} else if (week1 + leftdays == 7) {
			//如果刚好到周六，有一天休息日
			result += 1;
		}
	}
	return result;
}

/**
 * @summary 保留小数点位数
 * */
export function roundFixed(number, dig = 0) {
	return Math.round(number * Math.pow(10, dig)) / Math.pow(10, dig);
}

export function humpToLine(name) {
	name += '';
	let res = '';
	for (let letter of name) {
		if (/[A-Z]/.test(letter)) {
			res += `_${letter.toLowerCase()}`;
		} else {
			res += letter;
		}
	}
	return res;
}

export function objectToQueryString(obj) {
	if (!obj) {
		return '';
	}
	const queryParams = [];
	for (let key in obj) {
		// eslint-disable-next-line no-prototype-builtins
		if (obj.hasOwnProperty(key)) {
			let value = obj[key];
			// 如果值为数组，则将每个元素都添加到查询参数中
			if (Array.isArray(value)) {
				value.forEach((item) => {
					queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
				});
			} else {
				queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
			}
		}
	}

	return queryParams.join('&');
}
export function formatThousands(input) {
	if (typeof input === 'number' || !isNaN(Number(input))) {
		var num = Number(input);
		return num.toLocaleString('en-US');
	} else {
		return input;
	}
}
