<template>
	<div class="top-bar-container">
<!--		<logo></logo>-->
		<div class="top-right">
			<tenant></tenant>
			<user></user>
		</div>
	</div>
</template>

<script>
import logo from './logo.vue';
import user from './user.vue';
import tenant from './tenant.vue';
export default {
	name: 'top-bar',
	components: {
		logo,
		user,
		tenant,
	},
};
</script>

<style lang="scss" scoped>
.top-bar-container {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	padding: 0 20px 0 11px;
	height: 80px;
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
