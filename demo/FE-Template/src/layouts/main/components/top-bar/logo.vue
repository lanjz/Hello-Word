<template>
	<div class="topbar-logo-container">
		<router-link
			key="expand"
			class="logo-link"
			to="/"
		>
			<img
				src="../../../../assets/logo.png"
				class="logo-image"
			/>
		</router-link>
		<h1 class="logo-text">{{ logoText }}</h1>
	</div>
</template>

<script>
export default {
	name: 'layout-topbar-logo',
	props: {
		logoText: {
			type: String,
			default: '共享作业数字化平台',
		},
	},
};
</script>

<style lang="scss" scoped>
.logoFade-enter-active {
	transition: opacity 1.5s;
}

.logoFade-enter,
.logoFade-leave-to {
	opacity: 0;
}

.topbar-logo-container {
	display: flex;
	align-items: center;
	.logo-image {
		height: 32px;
		margin-right: 8px;
		color: #000;
	}
	.logo-text {
		line-height: 30px;
		margin: 0;
		font-size: 16px;
		padding: 0;
		font-weight: bold;
	}
}
</style>
