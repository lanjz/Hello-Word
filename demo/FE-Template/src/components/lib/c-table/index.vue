<template>
  <el-table
      v-sticky="{top: 0, parent: 'window'}"
      :data="renderList"
      :key="updateKey"
      row-key="id"
      v-loading="loading"
      :height="tableHeight"
      v-bind="$attrs"
      class="c-table"
      :border="false"
      ref="tableRef"
  >
    <template v-slot:empty>
      <CEmpty
          type="result"
          top="40"
      />
    </template>
    <el-table-column
        label="序号"
        width="60"
        align="center"
        type="index"
        v-if="showIndex"
    />
    <Column
        v-for="(item, ind) in columns"
        :key="item.prop || ind"
        :data="renderList"
        :columnData="item"
    ></Column>
  </el-table>
  <slot name="tableAfter"></slot>
  <div class="c-pagination">
    <el-pagination
        v-if="!hidePage && renderList.length"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 40, 60, 100, 150]"
        :page-size="pageSize"
        layout="total,->, sizes,prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { fetch } from '@/utils/request';
import Render from './render.vue';
import Column from './column.vue';
export default {
	name: 'c-table',
	props: {
		height: String,
		columns: {
			type: Array,
			default: () => [],
		},
		params: {
			type: Object,
			default: () => {},
		},
		postData: {
			type: Object,
			default: () => {},
		},
		list: undefined || Array,
		method: {
			type: String,
			default: () => 'get',
		},
		url: {
			type: String,
		},
		showIndex: {
			type: Boolean,
			default: () => false,
		},
		suspended: {
			type: Boolean,
			default: () => false,
		},
		filterData: {
			type: Function,
		},
		fullHeight: {
			type: Boolean,
			default: () => false,
		},
		hidePage: {
			type: Boolean,
			default: () => false,
		},
	},
  directives: {
    sticky: {
      mounted(el, binding) {
        // 获取表格(element)
        el = el.children[0]
        let thead = el.children[1];
        let tbody = el.children[2];
        // 获取滚动元素
        const scrollParent = document.querySelector(binding.value.parent);
        window.onscroll = function() {
          const theadHeight = thead.clientHeight
          // 获取thead距离顶部的距离
          let theadTop = thead.getBoundingClientRect().top;
          if (theadTop <= binding.value.top) {
            tbody.style.paddingTop = theadHeight + 'px'
            thead.style.position = 'fixed';
            thead.style.zIndex = '2021';
            thead.style.top = binding.value.top + 'px';
            thead.style.width = tbody.offsetWidth + 'px';
            thead.style.borderTop = '1px solid #EBEBEB';
            document.getElementById('app').classList.add('tabled-header-fixed')
          }
          // 判断是否需要回归原来位置
          let originally = tbody.getBoundingClientRect().top;
          // 判断底部距离是否超过表头
          let goBeyond = tbody.getBoundingClientRect().bottom;
          if (originally > binding.value.top || goBeyond <= thead.offsetHeight) {
            tbody.style.paddingTop = '0'
            thead.style.position = 'relative';
            thead.style.zIndex = '0';
            thead.style.top = 0 + 'px';
            thead.style.width = tbody.offsetWidth + 'px';
            thead.style.borderTop = 'none';
            document.getElementById('app').classList.remove('tabled-header-fixed')
          }
        }
      }
    }
  },
	data() {
		return {
			tableData: [],
			loading: false,
			currentPage: 1,
			pageSize: 15,
			total: 0,
			updateKey: 1,
			pageSizeList: [10, 15, 20, 40, 60],
		};
	},
	computed: {
    tableHeight(){
      // if(!this.renderList.length) return '400px'
      return this.fullHeight ? this.height || 'calc(100% - 75px)' : undefined
    },
		renderList() {
			return this.list ? this.staticList : this.tableData;
		},
		staticList() {
			return this.hidePage ? this.list : this.list.slice(this.pageSize * (this.currentPage - 1), this.pageSize * (this.currentPage - 1) + this.pageSize);
		},
	},
	watch: {
		columns: function () {
			this.updateKey++;
		},
		list: {
			handler: function () {
				if (this.list) {
					this.tableData = this.list;
					this.total = this.list.length;
				}
				this.currentPage = 1;
			},
			immediate: true,
		},
	},
	// eslint-disable-next-line vue/no-unused-components
	components: { Render, Column },
	methods: {
		getStaticData() {},
		async fetchData() {
			if (this.list) return;
			if (this.loading) return;
			this.loading = true; // 防止重复请求
			let { err, data } = await fetch({
				url: this.url,
				method: this.method,
				data: {
					...this.postData,
					pageSize: this.pageSize,
					pageNum: this.currentPage,
				},
				params: {
					...this.params,
					pageSize: this.pageSize,
					pageNum: this.currentPage,
				},
			});
			this.loading = false;
			if (!err) {
        console.log('data', data)
				if (this.filterData) {
					data = this.filterData(data);
				}
				this.tableData = (data.data.list || []).map((item) => {
					if (this.$attrs['tree-props']) {
						item.showChildren = false;
					}
					return {
						...item,
					};
				});
				this.total = data.data.totalSize;
			}
		},
		handleSizeChange(value) {
			this.pageSize = value;
			this.currentPage = 1;
			this.fetchData();
		},
		handleCurrentChange(value) {
			this.currentPage = value;
			this.fetchData();
		},
		reFetchData() {
			this.currentPage = 1;
			// this.pageSize = 15;
			return this.fetchData();
		},
		getMinW(item) {
			if (item.minWidth) return item.minWidth;
			let wl = 0;
			let znl = 0;
			for (let i of item.label) {
				if (/\w/.test(i)) {
					wl++;
				} else {
					znl++;
				}
			}
			return Math.max(znl * 15 + wl * 9 + 35, 100);
		},
		getW(item) {
			if (item.width) return item.width;
		},
		getEl() {
			return this.$refs.tableRef;
		},
		forceUpdate() {
			this.tableData = [...this.tableData];
		},
	},
	mounted() {
		if (this.suspended) return;
		this.fetchData();
	},
};
</script>

<style lang="scss" scoped>
.full-height {
	height: 100%;
}
.customer-empty {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -80%);
}
</style>
