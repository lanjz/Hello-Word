import mitt from 'mitt';
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

export const CViewEventBus = new mitt();

export function CViewEmit(type) {
	if (type === 'updateLayout') {
		CViewEventBus.emit('c-form-layout-update');
	}
}
