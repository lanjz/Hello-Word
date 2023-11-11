<template>
	<div class="global-container-wrap global-flex-column">
		<div class="global-search-box">
			<f-form
				keep
				inline
				class="search-form"
				:model="searchForm"
				:column="searchFormConfig"
				:loading="isLoading"
				@confirm="onSearch"
				@reset="resetSearch"
			/>
		</div>
		<div class="global-page-main-wrap h-0 global-flex-1 global-margin-top">
			<FTable
				ref="table"
				:columns="tableColumns"
				:postData="searchForm"
				method="post"
				fullHeight
				url="/admin/sharedCenter/list"
			/>
		</div>
		<!--新增修改基本信息-->
		<FDrawer
			destroy-on-close
			title="详情"
			isLook
			:visible.sync="editFormVisible"
			:loading="isLoading"
			@cancle="cancelDialog"
		>
			<f-form
				label-width="80px"
				:model="editForm"
				:column="editFormConfig"
				disabled
				hide-action
				ref="editForm"
			/>
		</FDrawer>
	</div>
</template>
<script>
import { tableConfig, editFormConfig, searchFormConfig } from './conf';
const defaultSearchForm = {
	sharedCenterName: '',
	status: '',
};
const defaultEditForm = {
	sharedCenterCode: '',
	sharedCenterName: '',
	parentName: '',
	remark: '',
	status: 1,
};
export default {
	name: 'sharedCenter',
	components: {},
	data() {
		return {
			// 搜索
			searchFormConfig,
			searchForm: { ...defaultSearchForm },
			tableColumns: tableConfig(this.handleInTable, this.AUTHBTN),
			// 编辑修改
			editForm: { ...defaultEditForm },
			editFormVisible: false,
			isLoading: false,
		};
	},
	computed: {
		editFormConfig() {
			return editFormConfig();
		},
	},
	mounted() {},
	methods: {
		handleInTable({ row }, type) {
			if (type === 'look') {
				this.editForm = { ...row };
				this.editFormVisible = true;
			}
		},
		resetSearch() {
			this.searchForm = {
				...defaultSearchForm,
			};
		},
		onSearch() {
			this.$refs.table.reFetchData();
		},
		cancelDialog() {
			this.editFormVisible = false;
		},
	},
};
</script>
<style lang="scss" scoped></style>
