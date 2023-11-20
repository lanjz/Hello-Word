<template>
	<template
		v-if="!menusItem.hide"
	>
		<el-sub-menu
			popper-class="app-popper-menu"
			v-if="hasChild"
			:index="menusItem.path || menusItem.moduleCode"
		>
			<template #title>
			   <div :style="{ marginLeft: curDeep * 22 + 'px' }"></div>
          <i
              class="module-icon iconfont"
              :class="menusItem.icon"
              v-if="deep === -1"
          />
					<span
              class="has-icon-module-name"
              :class="{ 'sub-item-title': deep > -1 }"
          >{{ menusItem.title }}</span
          >
			</template>
			<left-menus-item
				v-for="item in menusItem.childModules"
				:menusItem="item"
				:key="item.moduleCode"
				:is-collapse="isCollapse"
				:deep="curDeep"
			></left-menus-item>
		</el-sub-menu>

		<el-menu-item
			v-else
			:index="menusItem.path"
		>
     <i
         class="module-icon iconfont"
         :class="menusItem.icon"
         v-if="deep === -1"
     />
      <template #title><span :style="{ marginLeft: curDeep * 24 + 'px' }">{{ menusItem.title }}</span></template>
		</el-menu-item>
	</template>
</template>

<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
export default {
	name: 'left-menus-item',
	components: {
		// AppLink,
    Location
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
	width: auto !important;
	font-size: 20px;
  left: -2px;
  margin-right: 14px;
}
.has-icon-module-name {
	//margin-left: 8px;
}
</style>
