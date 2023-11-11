<template>
	<div
		class="layout-menus-container global-flex-column"
		:class="{ noCollapse: !isCollapse }"
	>
		<div class="global-flex-1 scroll">
			<el-menu
				class="el-menu-vertical"
				mode="vertical"
				router
				background-color="#f2f4f7"
				:default-active="activeMenu"
				:collapse="isCollapse"
				:unique-opened="true"
				:collapse-transition="false"
			>
				<LeftMenusItem
					v-for="menusItem in menusData"
					:menusItem="menusItem"
					:isCollapse="isCollapse"
					:key="menusItem.moduleCode"
				/>
			</el-menu>
		</div>
		<div
			class="btn-collapse-box"
			:style="{ 'text-align': isCollapse ? 'center' : 'left' }"
		>
			<CSvgIcon
				v-if="isCollapse"
				class="icon"
				name="fold-close"
				@click="collapseChange"
			/>
			<CSvgIcon
				v-else
				name="fold-open"
				class="icon"
				style="margin-left: 12px"
				@click="collapseChange"
			/>
		</div>
	</div>
</template>

<script>
import LeftMenusItem from './left-menus-item';
import { CViewEventBus } from '@/components/lib/utils';
export default {
	name: 'left-menus',
	components: {
		LeftMenusItem,
	},
	inject: ['menus'],
	data() {
		return {
			isCollapse: false,
			activeMenu: this.$route.matched[1] ? this.$route.matched[1].path : this.$route.path,
		};
	},
	watch: {
		$route: function () {
			this.activeMenu = this.$route.matched[1] ? this.$route.matched[1].path : this.$route.path;
		},
	},
	computed: {
		menusData() {
			return this.menus();
		},
	},
	mounted() {},
	methods: {
		collapseChange() {
			this.isCollapse = !this.isCollapse;
			CViewEventBus.$emit('c-form-layout-update');
		},
	},
};
</script>

<style lang="scss" scoped>
.layout-menus-container {
	flex-shrink: 0;
	&.noCollapse {
		padding-right: 20px;
	}
	.scroll {
		height: 0;
		overflow: auto;
	}
	.el-menu-vertical {
		border: none;
		padding: 0 4px;
	}
	.el-menu-vertical:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
	}

	.btn-collapse-box {
		position: relative;
		padding: 12px 0;
		text-align: center;
		flex-shrink: 0;
		color: #666;
		.icon {
			cursor: pointer;
			&:hover {
				color: $--color-primary;
			}
		}
	}
}
</style>
<style lang="scss">
.layout-menus-container,
.app-popper-menu {
	// 右侧 icon 位置
	.el-submenu__icon-arrow {
		right: 10px;
		font-size: 13px;
		width: 16px;
		height: 14px;
		font-weight: bold;
	}
	.el-submenu [class^='el-icon-'] {
		margin-right: 8px;
		width: 16px;
		height: 16px;
	}
	.el-menu-item,
	.el-submenu__title {
		height: 40px;
		line-height: 40px;
		margin-top: 4px;
		border-radius: 4px;
		min-width: 100%;
		color: #666;
		padding: 0 8px !important;
	}
	.el-menu-item > .el-submenu__title {
		padding: 0 8px !important;
	}
	// 标题
	.menu-title-wrap {
		display: flex;
		align-items: center;
		i {
			width: 16px;
			height: 16px;
			font-size: 17px;
		}
	}
	//悬停时的颜色
	.el-submenu__title:hover,
	.el-menu-item:not(.is-active):hover {
		background-color: #fff !important;
		color: $--color-primary !important;
		i {
			color: $--color-primary !important;
		}
		.sub-item-title:before {
			background: $--color-primary;
		}
	}
	// 标题样式
	.sub-item-title {
		display: flex;
		align-items: center;
		&:before {
			content: '';
			display: inline-block;
			background: #666;
			width: 3px;
			height: 3px;
			border-radius: 50%;
			margin-right: 8px;
		}
	}
	//已展开的菜单颜色
	.is-opened {
		& > .el-submenu__title {
			color: $--color-primary;
			text-shadow: 0 0 0.25px currentcolor;
			i {
				color: $--color-primary;
			}
		}
	}
	/*选中时的颜色*/
	.el-menu-item.is-active {
		color: #fff;
		position: relative;
		background-color: $--color-primary !important;
		.sub-item-title:before {
			background: #fff;
		}
	}
}
/*收起*/
.el-menu--collapse {
	width: 48px;
}
.el-menu--collapse > .menus-item-container > .el-submenu > .el-submenu__title {
	text-align: center;
}
.el-menu--collapse > .menus-item-container > .el-menu-item .el-submenu__icon-arrow,
.el-menu--collapse > .menus-item-container > .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
	display: none;
}
// 收起时第一层的文本隐藏，只显示ICON
.el-menu--collapse span > .el-submenu > .el-submenu__title > div > span {
	display: none;
}
/*悬浮展开*/
.app-popper-menu > .el-menu--popup {
	padding: 0px 4px 4px 4px;
	min-width: 184px;
	background: #fff !important;
	.el-menu-item,
	.el-submenu__title {
		height: 32px;
		line-height: 32px;
		background: #fff !important;
		&.is-active {
			background: $--color-primary !important;
		}
	}
	//悬停时的颜色
	.el-submenu__title:hover,
	.el-menu-item:not(.is-active):hover {
		background-color: #f2f4f7 !important;
		color: $--color-primary !important;
	}
}
</style>
