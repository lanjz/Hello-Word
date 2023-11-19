<template>
	<section class="app-main">
		<transition
			name="fade-transform"
			mode="out-in"
		>
			<keep-alive
				:include="includes"
				:max="10"
			>
				<router-view
					:key="key"
					:pageId="moduleId"
				/>
			</keep-alive>
		</transition>
	</section>
</template>

<script>
export default {
	name: 'layout-app-main',
	props: ['keepAliveIncludes'],
	computed: {
		key() {
			return this.$route.fullPath;
		},
		moduleId() {
			return this.$route.meta.moduleId;
		},
		includes() {
			// return this.keepAliveIncludes
			return process.env.NODE_ENV === 'development' ? [] : this.keepAliveIncludes;
		},
	},
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.app-main {
	/* 50= navbar  50  */
	width: 100%;
	position: relative;
	//background: #fff;
	box-sizing: border-box;
  border-radius: 6px;
}

.fixed-header + .app-main {
	padding-top: 64px;
}

.hasTagsView {
	.app-main {
		/* 84 = navbar + tags-view = 50 + 34 */
		height: 100vh;
		background-color: #f5f7fa;
		overflow-y: auto;
		padding-top: 20px;
	}

	.fixed-header + .app-main {
		padding-top: 104px;
	}
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
	.fixed-header {
		padding-right: 15px;
	}
}
</style>
