<template>
	<div class="main-container">
		<topBar></topBar>
		<botomContent></botomContent>
		<!-- <el-row class="content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
          </keep-alive>
        </transition>
      </router-view>
    </el-row> -->
	</div>
</template>

<script>
import topBar from './components/top-bar';
import botomContent from './components/bottom-content';

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
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
</style>
