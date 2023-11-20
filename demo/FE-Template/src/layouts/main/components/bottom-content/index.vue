<template>
	<div class="layout-bottom-container">
		<menus></menus>
		<div class="right-wrap">
<!--			<routerTags @updateInclude="updateInclude" />-->
			<appMain :keepAliveIncludes="keepAliveIncludes" />
		</div>
	</div>
</template>

<script>
import menus from './left-menus.vue';
import routerTags from './app-router-tags/index.vue';
import appMain from './right-main.vue';
export default {
	name: 'bottom-content',
	components: {
		menus,
		routerTags,
		appMain,
	},
	data() {
		return {
			keepAliveIncludes: [],
		};
	},
	methods: {
		updateInclude(list) {
			this.keepAliveIncludes = list;
		},
	},
};
</script>

<style lang="scss" scoped>
.layout-bottom-container {
	background-color: $--app-bg-color;
	.right-wrap {
		min-width: 0;
		padding: 0 20px;
		padding-left: 0;
	}
}
</style>
