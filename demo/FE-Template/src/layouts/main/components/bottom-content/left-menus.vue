<template>
	<div
		class="layout-menus-container global-flex-column"
		:class="{ noCollapse: !isCollapse }"
	>
    <div class="menu-logo">哈哈哈内个哈</div>
		<div class="global-flex-1 scroll">
			<el-menu
				class="el-menu-vertical"
				mode="vertical"
				router
				background-color="transparent"
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
      <i
          class="icon icon-zhankai-01 iconfont"
          @click="collapseChange"
          v-if="isCollapse"
      >
      </i>
      <i
          style="margin-left: 24px"
          class="icon icon-zhedie-01 iconfont"
          @click="collapseChange"
          v-else
      >
      </i>
		</div>
	</div>
</template>

<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import LeftMenusItem from './left-menus-item.vue';
import { CViewEventBus } from '@/components/lib/utils';
import { moduleRoutes} from '@/router/modules';

export default {
	name: 'left-menus',
	components: {
		LeftMenusItem,
    Setting,
	},
	data() {
		return {
			isCollapse: false,
			// activeMenu: this.$route.matched[1] ? this.$route.matched[1].path : this.$route.path,
			activeMenu: this.$route.path,
		};
	},
	watch: {
		$route: function () {
			this.activeMenu = this.$route.matched[1] ? this.$route.matched[1].path : this.$route.path;
		},
    isCollapse: {
      handler: function (val){
        document.documentElement.style && document.documentElement.style.setProperty('--body-left', (!val ? 270 : 100) + 'px')
      },
      immediate: true
    }
	},
	computed: {
		menusData() {
			return this.menus();
		},
	},
	mounted() {
  },
	methods: {
    menus(){
      const walk = (list) => {
        return list.map(item => {
          const { path, meta = {}, children = [] } = item
          return {
            path,
            ...meta,
            childModules: walk(children)
          }
        })
      }
      return walk(moduleRoutes)
    },
		collapseChange() {
			this.isCollapse = !this.isCollapse;
			CViewEventBus.emit('c-form-layout-update');
		},
	},
};
</script>

<style lang="scss" scoped>
.menu-logo {
  position: absolute;
  top: -50px;
  left: 10px;
  color: #1d253b;
}
.layout-menus-container {
	flex-shrink: 0;
  background: linear-gradient(0deg,#0098f0,#00f2c3);
  transition-property: top,bottom,width;
  transition-duration: .2s,.2s,.35s;
  transition-timing-function: linear,linear,ease;
  //width: 230px;
  height: calc(100vh - 90px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-size: cover;
  box-shadow: 0 2px 22px 0 rgba(0,0,0,.1), 0 4px 20px 0 rgba(0,0,0,.15);
  margin-top: 80px;
  margin-left: 20px;
  border-radius: 5px;
  transition: .5s cubic-bezier(.685,.0473,.346,1);
	&.noCollapse {
		//padding-right: 20px;
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
		width: 230px;
		min-height: 400px;
	}

	.btn-collapse-box {
		position: relative;
		padding: 12px 0;
		text-align: center;
		flex-shrink: 0;
		color: #c6d7e8;
    background: rgb(9 9 9 / 10%);
    margin-bottom: 12px;
		.icon {
			cursor: pointer;
      margin: 0 auto;
      color: #fff;
      font-size: 18px;
			&:hover {
				color: $--color-primary;
			}
		}
	}
}
</style>
<style>
.el-menu--popup{
  box-sizing: border-box;
  box-shadow: none;
  padding: 0 4px;
  .sub-item-title:before {
    background: #464b49;
  }
}
.app-popper-menu{
  .el-menu-item, .el-sub-menu__title{
    border-radius: 4px;
    height: 40px;
    line-height: 40px;
    &.is-active {
      background: #00f2c3;
      color: #fff;
    }
  }
  .app-popper-menu{
    top: -4px !important;
  }
}
.el-popper{
  .el-sub-menu__title, .el-menu-item{
    color: #464b49;
    margin-bottom: 5px;
    &:hover{
      background: #d2f5ee;
    }
  }
}
.sub-item-title {
  display: flex;
  align-items: center;
  &:before {
    content: '';
    display: inline-block;
    background: #fff;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
.el-sub-menu__title, .el-menu-item{
  padding: 0 !important;
  padding-left: 20px !important;
  margin-top: 5px;
  //margin-bottom: 8px !important;
  border-radius: 4px;
  &.is-active {
    background: #fff;
  }
}
.el-menu:not(.el-menu--collapse, .el-menu--popup){
  .el-sub-menu__title, .el-menu-item{
    padding: 0 !important;
    padding-left: 20px !important;
  }
}
</style>