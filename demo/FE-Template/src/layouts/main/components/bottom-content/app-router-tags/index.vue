<template>
	<div
		class="tags-view-container"
		v-if="visitedViews.length"
	>
		<el-tabs
			class="tags-view-wrapper"
			v-model="visibleTabsValue"
			type="card"
		>
			<el-tab-pane
				v-for="tag in visitedViews"
				:key="tag.path"
				:name="tag.path"
			>
				<router-link
					slot="label"
					:key="tag.path"
					:class="{ active: isActive(tag) }"
					:to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
					tag="span"
					class="tags-view-item"
					@click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
					@contextmenu.prevent.native="openMenu(tag, $event)"
				>
					<div class="tag-item">
						<span class="text">{{ tag.query && tag.query.tagTitle ? tag.query.tagTitle : tag.meta.title }}</span>
						<i
							v-if="!isAffix(tag)"
							class="el-icon-close close-icon"
							@click.prevent.stop="closeSelectedTag(tag)"
						/>
					</div>
				</router-link>
			</el-tab-pane>
		</el-tabs>
		<ul
			v-show="visible"
			:style="{ left: left + 'px', top: top + 'px' }"
			class="contextmenu"
		>
			<li @click="refreshSelectedTag(selectedTag)">刷新</li>
			<li
				v-if="!isAffix(selectedTag)"
				@click="closeSelectedTag(selectedTag)"
			>
				关闭
			</li>
			<li @click="closeOthersTags(selectedTag)">关闭其他</li>
			<li @click="closeAllTags(selectedTag)">关闭所有</li>
		</ul>
	</div>
</template>

<script>
import { HOME_PATH } from '@/router/modules/index';
import { CViewEventBus } from '@/components/lib/utils';
export default {
	name: 'app-router-tag',
	data() {
		return {
			visible: false,
			top: 0,
			left: 0,
			selectedTag: {},
			visitedViews: [],
			visibleTabsValue: this.$router.path,
		};
	},
	watch: {
		$route: {
			handler: function () {
				this.addTags();
			},
		},
		visible(value) {
			if (value) {
				document.body.addEventListener('click', this.closeMenu);
			} else {
				document.body.removeEventListener('click', this.closeMenu);
			}
		},
		visitedViews() {
			this.doUpdateInclude();
		},
	},
	methods: {
		isActive(route) {
			this.visibleTabsValue = this.$route.path;
			return route.path === this.$route.path;
		},
		isAffix(tag) {
			return tag.meta && tag.meta.affix;
		},
		addTags(r = this.$route) {
			if (r.name === 'main') {
				return;
			}
			let findIndex = this.visitedViews.findIndex((item) => item.path === r.path);
			if (findIndex < 0) {
				this.visitedViews.push(r);
			} else {
				// 可能有其它的属性发生了变化，所以这里做下覆盖操作
				this.visitedViews[findIndex] = this.$route;
				this.doUpdateInclude();
			}
		},
		doUpdateInclude(list = this.visitedViews) {
			let nameList = list.map((item) => {
				let getMatchedComponents = this.$router.getMatchedComponents(item.path);
				if (getMatchedComponents.length < 2) {
					return null;
				}
				return getMatchedComponents[getMatchedComponents.length - 1].name;
			});
			this.$emit(
				'updateInclude',
				nameList.filter((item) => item)
			);
		},
		refreshSelectedTag(view) {
			let getList = this.visitedViews.filter((item) => item.path !== view.path);
			this.doUpdateInclude(getList);
			const { fullPath } = view;
			this.$router.replace({
				path: '/refresh-page',
				query: {
					to: fullPath,
				},
			});
		},
		closeSelectedTag(view) {
			let index = this.visitedViews.findIndex((item) => item.path === view.path);
			if (view.path === this.$route.path) {
				let changeIndex = index === this.visitedViews.length - 1 ? index - 1 : index + 1;
				this.$router.push(this.visitedViews[changeIndex] ? this.visitedViews[changeIndex].fullPath : HOME_PATH);
			}
			this.visitedViews.splice(index, 1);
		},
		closeOthersTags(r) {
			this.$router.push(this.selectedTag, () => {});
			this.visitedViews = this.visitedViews.filter((item) => item.meta.affix || item.path === r.path);
		},
		closeAllTags() {
			this.$router.push(HOME_PATH, () => {});
			this.visitedViews = this.visitedViews.filter((item) => item.meta.affix);
		},
		openMenu(tag, e) {
			this.left = Math.min(e.clientX, document.body.clientWidth - 120);
			this.top = e.clientY;
			this.visible = true;
			this.selectedTag = tag;
		},
		closeMenu() {
			this.visible = false;
		},
		emitCloseTag() {
			const findCurRouter = this.visitedViews.find((item) => this.isActive(item));
			findCurRouter && this.closeSelectedTag(findCurRouter);
		},
	},
	destroyed() {
		CViewEventBus.off('closeTag', this.emitCloseTag);
	},
	mounted() {
		CViewEventBus.off('closeTag', this.emitCloseTag);
		CViewEventBus.on('closeTag', this.emitCloseTag);
		this.$router.getRoutes().forEach((item) => {
			if (item.meta && item.meta.affix) {
				// 添加固定的 路由
				this.addTags({ ...item, fullPath: item.path });
			}
		});
		// 添加当前 路由
		this.addTags();
	},
};
</script>

<style lang="scss" scoped>
.tags-view-container {
	padding: 0;
	width: 100%;
	.tags-view-wrapper {
		.tag-item {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 13px;
		}
		.text {
			display: inline-block;
			//width: 72px;
			//overflow: hidden;
			//text-overflow:ellipsis;
			//white-space: nowrap;
		}
		.close-icon {
			width: 14px;
			height: 14px;
			line-height: 14px;
			text-align: center;
			font-size: 16px;
			color: $--color-text-secondary;
			transform-origin: 50% 50%;
			transform: scale(0.8);
			&:hover {
				color: $--color-danger;
			}
		}
		.tags-view-item {
			vertical-align: bottom;
			display: inline-block;
			position: relative;
			cursor: pointer;
			height: 36px;
			line-height: 36px;
			box-sizing: border-box;
			color: #333;
			padding: 0 12px;
			text-align: center;
			&.active {
				background-color: #fff;
				border-radius: 12px 12px 0 0;
				color: #141222;
				font-weight: bold;
				&:after {
					content: '';
					display: block;
					width: 10px;
					height: 10px;
					background: red;
					position: absolute;
					right: 0;
					bottom: 0;
					background: radial-gradient(10px at 10px 0px, transparent 10px, #fff 10px);
					transform: translateX(100%);
				}
				&:before {
					content: '';
					display: block;
					width: 10px;
					height: 10px;
					background: red;
					position: absolute;
					left: 0;
					bottom: 0;
					background: radial-gradient(10px at 0px 0px, transparent 10px, #fff 10px);
					transform: translateX(-100%);
				}
			}
		}
	}
	::v-deep .el-tabs__header {
		margin: 0;
		.el-tabs__item {
			padding: 0px;
			height: 36px;
			line-height: 36px;
		}
		.el-tab__item.is-top:nth-child(2) {
			margin-left: 0;
		}
		.el-tabs__nav-wrap::after {
			display: none;
		}
		.el-tabs__active-bar {
			display: none;
		}
	}
	::v-deep .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
		padding-left: 0;
	}
	.contextmenu {
		margin: 0;
		background: #fff;
		z-index: 3000;
		position: fixed;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
		li {
			margin: 0;
			padding: 7px 16px;
			cursor: pointer;
			&:hover {
				background: #eee;
			}
		}
	}
}
::v-deep {
	.el-tabs__nav-next,
	.el-tabs__nav-prev {
		line-height: 30px;
		background: inherit;
		i {
			color: $--color-text-primary;
			margin: 0;
		}
	}
	.el-tabs__item:focus.is-active.is-focus:not(:active) {
		box-shadow: none;
	}
}
</style>
