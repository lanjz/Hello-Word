<template>
	<span
		v-if="!menusItem.hide"
		class="menus-item-container"
	>
		<el-submenu
			popper-class="app-popper-menu"
			v-if="hasChild"
			:index="menusItem.path || menusItem.moduleCode"
		>
			<template slot="title">
				<div :style="{ marginLeft: curDeep * 18 + 'px' }">
					<CSvgIcon
						v-if="deep === -1"
						class="module-icon"
						:name="menusItem.moduleIcon"
					/>
					<span
						slot="title"
						class="has-icon-module-name"
						:class="{ 'sub-item-title': deep > -1 }"
						>{{ menusItem.title }}</span
					>
				</div>
			</template>
			<left-menus-item
				v-for="item in menusItem.childModules"
				:menusItem="item"
				:key="item.moduleCode"
				:is-collapse="isCollapse"
				:deep="curDeep"
			></left-menus-item>
		</el-submenu>

		<el-menu-item
			v-else
			:index="menusItem.path"
		>
			<span :style="{ marginLeft: curDeep * 24 + 'px' }">{{ menusItem.title }}</span>
		</el-menu-item>
	</span>
</template>

<script>
// import AppLink from '../common/app-link';
export default {
	name: 'left-menus-item',
	components: {
		// AppLink,
	},
	props: {
		deep: {
			default: () => -1,
		},
		menusItem: {
			type: Object,
			default: () => {
				return {};
			},
		},
		isCollapse: Boolean,
	},
	computed: {
		curDeep() {
			return this.isCollapse ? 0 : this.deep + 1;
		},
		hasChild() {
			const { childModules } = this.menusItem;
			return Array.isArray(childModules) && childModules.length > 0;
		},
	},
};
</script>
<style lang="scss" scoped>
.module-icon {
	width: 16px;
	font-size: 16px;
}
.has-icon-module-name {
	margin-left: 8px;
}
</style>
