<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
import { fetch } from '@/utils/request';

export default {
	name: 'app',
	methods: {
		setOutTime() {
			// 挂到 window 下，免得热更新的时候重复创建定时器
			clearTimeout(window.getSwitchStatusTimeOutST);
			window.getSwitchStatusTimeOutST = setTimeout(this.getSwitchStatus, 60 * 1000);
		},
		async getSwitchStatus() {
			await fetch({
				url: '/task/employee-accept-order-switch/get',
			});
			this.setOutTime();
		},
	},
	watch: {
		'$store.state.user.shareCenterCode': {
			immediate: true,
			handler: function (val) {
				if (val) {
					setTimeout(this.getSwitchStatus, 5000);
				}
			},
		},
	},
};
</script>

<style lang="scss">
body {
	padding: 0;
	margin: 0;
}
</style>
