import Vue from 'vue';
export function rafThrottle(fn) {
	let locked = false;
	return function (...args) {
		if (locked) return;
		locked = true;
		window.requestAnimationFrame(() => {
			fn.apply(this, args);
			locked = false;
		});
	};
}

export const CViewEventBus = new Vue();

export function CViewEmit(type) {
	if (type === 'updateLayout') {
		CViewEventBus.$emit('c-form-layout-update');
	}
}
