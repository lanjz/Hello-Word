<template>
	<div class="top-bar-container">
		<logo></logo>
		<div class="top-right">
			<!--			<tenant></tenant>-->
			<shareCenter></shareCenter>
			<user :userName="userName"></user>
		</div>
	</div>
</template>

<script>
import logo from './logo.vue';
import user from './user.vue';
// import tenant from './tenant.vue';
import shareCenter from './share-center.vue';
export default {
	name: 'top-bar',
	components: {
		logo,
		user,
		// tenant,
		shareCenter,
	},
	computed: {
		userName() {
			return this.$store.state.user.loginInfo.userName;
		},
	},
};
</script>

<style lang="scss" scoped>
.top-bar-container {
	background-color: $--app-bg-color;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px 0 11px;
	height: 68px;
	box-sizing: border-box;
}
.top-right {
	display: flex;
	align-items: center;
	& > div {
		margin-left: 20px;
	}
}
</style>
