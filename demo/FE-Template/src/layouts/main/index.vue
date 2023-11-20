<template>
	<div class="main-container">
		<topBar></topBar>
		<botomContent></botomContent>
	</div>
</template>

<script>
import topBar from './components/top-bar/index.vue';
import botomContent from './components/bottom-content/index.vue';

export default {
	name: 'layout-main',
	components: {
		topBar,
		botomContent,
	},
	props: {
		menus: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
	provide() {
		return {
			menus: () => {
				return this.menus;
			},
		};
	},
	mounted() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
* {
	margin: 0;
	padding: 0;
}
.main-container {
	width: 100%;
  padding-left: var(--body-left);
}
</style>
