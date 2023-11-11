<template>
	<div
		:class="{ 'full-height': fullHeight }"
		style="overflow: hidden"
		:key="updateKey"
		class="global-relative"
	>
		<el-table
			:data="renderList"
			row-key="id"
			v-loading="loading"
			:height="fullHeight ? height || 'calc(100% - 75px)' : undefined"
			v-bind="$attrs"
			v-on="$listeners"
			class="c-table"
			size="medium"
			ref="tableRef"
		>
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
			<template slot="empty">
				<span></span>
				<!--				<FEmpty
					type="result"
					top="40"
				></FEmpty>-->
			</template>
		</el-table>
		<slot name="tableAfter"></slot>
		<el-pagination
			v-if="!hidePage"
			background
			style="margin-top: 15px"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 15, 20, 40, 60, 100, 150]"
			:page-size="pageSize"
			layout="total,->, sizes,prev, pager, next, jumper"
			:total="total"
		>
			<div
				class="global-flex-1 global-flex"
				style="justify-content: space-between"
			>
				<div class="total-wrap">
					共<b>{{ total }}</b
					>条
				</div>
				<div class="page-size-wrap">
					每页
					<el-select
						v-model="pageSize"
						@change="handleSizeChange"
						size="mini"
					>
						<el-option
							v-for="item in pageSizeList"
							:key="item"
							:value="item"
							>{{ item }}</el-option
						>
					</el-select>
					条
				</div>
			</div>
		</el-pagination>
		<FEmpty
			v-if="!renderList.length"
			class="customer-empty"
			type="result"
			top="40"
		></FEmpty>
	</div>
</template>

<script>
import { fetch } from '@/utils/request';
import Render from './render';
import Column from './column';
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
				if (this.filterData) {
					data = this.filterData(data);
				}
				this.tableData = (data.data.rows || []).map((item) => {
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
