/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
	const valid_map = ['admin', 'editor'];
	return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
	const reg =
		// eslint-disable-next-line vue/max-len
		/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return reg.test(url);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
	const reg = /^[a-z]+$/;
	return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
	const reg = /^[A-Z]+$/;
	return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
	const reg = /^[A-Za-z]+$/;
	return reg.test(str);
}

/**
 * @param {string} email
 * @return {Boolean}
 */
export function validEmail(email) {
	const reg =
		// eslint-disable-next-line no-useless-escape
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return reg.test(email);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
	if (typeof str === 'string' || str instanceof String) {
		return true;
	}
	return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
	if (typeof Array.isArray === 'undefined') {
		return Object.prototype.toString.call(arg) === '[object Array]';
	}
	return Array.isArray(arg);
}

/**
 * @summary 校验数字，支持包含小数点
 * @param { string|number } val
 * @param { number } dig 支持几位小数点
 * */
export function validNum(val, dig = 0, negative) {
	val = val + '';
	if (dig >= 1) {
		let regExpress = '(\\d+|\\d+\\.\\d{1,' + dig + '})$';
		if (negative) {
			regExpress = '-?' + regExpress;
		}
		let reg = new RegExp('^' + regExpress);
		return reg.test(val);
	}
	return /^\d+$/.test(val);
}

export function validTel(val) {
	val = val + '';
	let reg = new RegExp('^400[0-9]{7}|^800[0-9]{7}|^1[34578]\\d{9}$|^0[0-9]{2,3}-[0-9]{8}');
	return reg.test(val);
}

/**
 * @summary 校验手机号
 * @param { string|number } mobile
 * @return {Boolean}
 * */
export function validPhone(mobile) {
	const re = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
	return mobile && re.test(mobile);
}
