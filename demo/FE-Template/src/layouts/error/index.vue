<template>
	<div>
		<topBar></topBar>
		<div style="text-align: center">
			<img
				src="~@/assets/empty.png"
				style="width: 300px; margin-top: 20px"
			/>
			<br />
			<span style="color: #666">资源加载错误了~</span> <br />
			<c-button
				plain
				type="primary"
				@click="gotoHome"
				style="margin-top: 20px"
				>尝试跳转到首页</c-button
			>
		</div>
	</div>
</template>

<script>
import topBar from '../main/components/top-bar.vue';
export default {
	name: 'layout-error',
	components: {
		topBar,
	},
	props: {
		status: String,
	},
	methods: {
		gotoHome() {
			this.$router.push('/');
		},
	},
	mounted() {
		if (window.IS_JUMP_HOME_FORM_Error) {
			return;
		}
		window.IS_JUMP_HOME_FORM_Error = true;
		this.$router.replace('/');
	},
};
</script>

<style lang="scss" scoped></style>
