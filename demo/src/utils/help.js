import { MessageBox } from 'element-ui';

export function getEnv() {
	const match = window.location.origin.match(/doct(.*)?.cn/);
	if (!match) return 'location';
	return match[1] ? 'sit' : 'pro';
}

/**
 * @summary 监控页面静态资源加载报错
 */
export function recordResourceError() {
	window.addEventListener(
		'error',
		function (e) {
			const { src, localName } = e.target;
			if (e.target instanceof HTMLElement && localName === 'script') {
				if (!sessionStorage.getItem(src)) {
					MessageBox.alert('当前页面资源已更新，是否重新加载页面？', '', {
						confirmButtonText: '确定',
						showCancelButton: true,
						callback: (action) => {
							if (action === 'confirm') {
								sessionStorage.setItem(src, 1);
								if (window.top !== window) {
									window.top.postMessage(
										JSON.stringify({
											type: 'reload',
										}),
										'*'
									);
								} else {
									window.location.reload();
								}
							}
						},
					});
				}
			}
		},
		true
	);
}
