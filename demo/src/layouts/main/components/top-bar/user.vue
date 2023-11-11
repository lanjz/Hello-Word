<template>
	<el-dropdown
		@command="handleCommand"
		trigger="click"
	>
		<div class="top-bar-user-container">
			<CSvgIcon
				class="user-icon"
				name="user-icon"
			/>
			<div class="user-text">{{ userName }}</div>
			<i class="el-icon-caret-bottom"></i>
		</div>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item command="gotoDownload">批导明细</el-dropdown-item>
			<el-dropdown-item command="logout">退出登录</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	name: 'header-user',
	props: {
		userName: {
			type: String,
			default: '未登录',
		},
	},
	methods: {
		...mapActions('user', ['LOGIN_OUT_POST']),
		async logout() {
			let isConfirm = await this.confirmMix('确定退出登录吗', '确认退出');
			if (isConfirm) {
				let { err } = await this['LOGIN_OUT_POST']();
				if (!err) {
					// window.location.reload()
				}
			}
		},
		handleCommand(command) {
			if (command === 'logout') {
				this.logout();
			} else if (command === 'gotoDownload') {
				this.$router.push('/my-download');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.top-bar-user-container {
	color: #141222;
	position: relative;
	display: flex;
	align-items: center;
	padding: 0 10px 0 12px;
	cursor: pointer;
	.user-icon {
		width: 16px;
		height: 16px;
	}
	.user-text {
		margin-left: 6px;
		margin-right: 8px;
		line-height: 23px;
	}
	.el-icon-caret-bottom {
		font-size: 12px;
	}
}
</style>
