<template>
	<el-dropdown
		@command="handleCommand"
		trigger="click"
	>
		<div class="top-bar-user-container">
			<CIcon
				class="user-icon"
				name="user-icon"
			/>
<!--			<div class="user-text">-&#45;&#45;{{ userName }}</div>-->
      <img class="avatar-wrap" src="@/assets/avatar.png" alt="">
			<i class="el-icon-caret-bottom"></i>
		</div>
		<template #dropdown>
			<el-dropdown-item command="gotoDownload">批导明细</el-dropdown-item>
			<el-dropdown-item command="logout">退出登录</el-dropdown-item>
		</template>
	</el-dropdown>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { userStore } from '@/stores/user'
export default {
	name: 'header-user',
  computed: {
    ...mapState(userStore, ['loginInfo']),
    userName() {
      return this.loginInfo.name;
    },
  },
	methods: {
		...mapActions(userStore, ['loginOutPost']),
		async logout() {
			let isConfirm = await this.confirmMix('确定退出登录吗', '确认退出');
			if (isConfirm) {
				let { err } = await this.loginOutPost();
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
.avatar-wrap{
  width: 30px;
  height: 30px;
  border-radius: 100%;
  object-fit: none;
}
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
/*:deep(.el-dropdown-menu__item) {
  padding: 20px 30px;
}*/
</style>
