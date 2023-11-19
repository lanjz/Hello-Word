<template>
	<div
		id="tags-view-container"
		class="tags-view-container"
	>
		<el-tabs
			v-model="activeName"
			ref="tagsView"
			class="tags-view-wrapper"
		>
			<el-tab-pane
				v-for="tag in visitedViews"
				:key="tag.name"
			>
				<router-link
					slot="label"
					ref="tag"
					:key="tag.path"
					:class="isActive(tag) ? 'active' : ''"
					:to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
					tag="span"
					class="tags-view-item"
					@click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
					@contextmenu.prevent.native="openMenu(tag, $event)"
				>
					{{ tag.title }}
					<span
						v-if="!isAffix(tag)"
						class="el-icon-close"
						@click.prevent.stop="closeSelectedTag(tag)"
					/>
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
			<li @click="closeOthersTags">关闭其他</li>
			<li @click="closeAllTags(selectedTag)">关闭所有</li>
		</ul>
	</div>
</template>

<script>
import path from 'path-browserify';

export default {
	data() {
		return {
			visible: false,
			top: 0,
			left: 0,
			selectedTag: {},
			affixTags: [],
			activeName: 'first',
		};
	},
	computed: {
		cachedViews() {
			return this.$store.state.tagsView.cachedViews;
		},
		visitedViews() {
			return this.$store.state.tagsView.visitedViews;
		},
		routes() {
			return this.$store.state.permission.routes;
		},
	},
	watch: {
		$route() {
			this.addTags();
			this.moveToCurrentTag();
		},
		visible(value) {
			if (value) {
				document.body.addEventListener('click', this.closeMenu);
			} else {
				document.body.removeEventListener('click', this.closeMenu);
			}
		},
	},
	mounted() {
		this.initTags();
		this.addTags();
	},
	methods: {
		isActive(route) {
			return route.path === this.$route.path;
		},
		isAffix(tag) {
			return tag.meta && tag.meta.affix;
		},
		filterAffixTags(routes, basePath = '/') {
			let tags = [];
			routes.forEach((route) => {
				if (route.meta && route.meta.affix) {
					const tagPath = path.resolve(basePath, route.path);
					tags.push({
						fullPath: tagPath,
						path: tagPath,
						name: route.name,
						meta: { ...route.meta },
					});
				}
				if (route.children) {
					const tempTags = this.filterAffixTags(route.children, route.path);
					if (tempTags.length >= 1) {
						tags = [...tags, ...tempTags];
					}
				}
			});
			return tags;
		},
		initTags() {
			const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
			for (const tag of affixTags) {
				// Must have tag name
				if (tag.name) {
					this.$store.dispatch('tagsView/addVisitedView', tag);
				}
			}
		},
		addTags() {
			const { name } = this.$route;
			if (name) {
				this.$store.dispatch('tagsView/addView', this.$route);
			}
			return false;
		},
		moveToCurrentTag() {
			const tags = this.$refs.tag;
			this.$nextTick(() => {
				for (const tag of tags) {
					if (tag.to.path === this.$route.path) {
						//this.$refs.scrollPane.moveToTarget(tag)
						// when query is different then update
						if (tag.to.fullPath !== this.$route.fullPath) {
							this.$store.dispatch('tagsView/updateVisitedView', this.$route);
						}
						break;
					}
				}
			});
		},
		refreshSelectedTag(view) {
			this.$store.dispatch('tagsView/delCachedView', view).then(() => {
				const { fullPath } = view;
				this.$nextTick(() => {
					this.$router.replace({
						path: '/redirect' + fullPath,
					});
				});
			});
		},
		closeSelectedTag(view) {
			this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
				if (this.isActive(view)) {
					this.toLastView(visitedViews, view);
				}
			});
		},
		closeOthersTags() {
			this.$router.push(this.selectedTag);
			this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
				this.moveToCurrentTag();
			});
		},
		closeAllTags(view) {
			this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
				if (this.affixTags.some((tag) => tag.path === view.path)) {
					return;
				}
				this.toLastView(visitedViews, view);
			});
		},
		toLastView(visitedViews, view) {
			const latestView = visitedViews.slice(-1)[0];
			if (latestView) {
				this.$router.push(latestView.fullPath);
			} else {
				// now the default is to redirect to the home page if there is no tags-view,
				// you can adjust it according to your needs.
				if (view.name === 'Dashboard') {
					// to reload home page
					this.$router.replace({ path: '/redirect' + view.fullPath });
				} else {
					this.$router.push('/');
				}
			}
		},
		openMenu(tag, e) {
			const menuMinWidth = 105;
			const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
			const offsetWidth = this.$el.offsetWidth; // container width
			const maxLeft = offsetWidth - menuMinWidth; // left boundary
			const left = e.clientX - offsetLeft + 15; // 15: margin right

			if (left > maxLeft) {
				this.left = maxLeft;
			} else {
				this.left = left;
			}

			this.top = e.clientY;
			this.visible = true;
			this.selectedTag = tag;
		},
		closeMenu() {
			this.visible = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.tags-view-container {
	height: 40px;
	width: 100%;
	padding: 0 10px;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	.tags-view-wrapper {
		.tags-view-item {
			display: inline-block;
			position: relative;
			cursor: pointer;
			height: 36px;
			line-height: 36px;
			border: 1px solid #f3f3f3;
			box-sizing: border-box;
			color: #495060;
			background: #fff;
			padding: 0 8px;
			font-size: 14px;
			margin-top: 4px;
			border-radius: 8px 8px 0 0;
			min-width: 74px;
			text-align: center;
			&.active {
				background-color: rgb(246, 251, 255);
				color: #409eff;
			}
		}
	}
	::v-deep .el-tabs__header {
		margin: 0;
		padding-left: 8px;
		.el-tabs__item {
			padding: 0px;
			height: 40px;
			line-height: 40px;
			margin-left: -4px;
		}
		.el-tabs__item.is-top:nth-child(2) {
			margin-left: 0;
		}
		.el-tabs__nav-wrap::after {
			display: none;
		}
		.el-tabs__active-bar {
			display: none;
		}
	}
	.contextmenu {
		margin: 0;
		background: #fff;
		z-index: 3000;
		position: absolute;
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
</style>

<style lang="scss">
.tags-view-wrapper {
	.tags-view-item {
		.el-icon-close {
			width: 16px;
			height: 16px;
			border-radius: 50%;
			text-align: center;
			transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
			transform-origin: 100% 50%;
			&:before {
				transform: scale(0.6);
				display: inline-block;
			}
			&:hover {
				background-color: #b4bccc;
				color: #fff;
			}
		}
	}
}
</style>
