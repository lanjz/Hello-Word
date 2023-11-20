<template>
	<div class="global-container-wrap global-flex-column">
		<div class="global-search-box">
			<f-form
				keep
				class="search-form"
				inline
				:model="searchForm"
				:column="searchFormConfig"
				:loading="isLoading"
				@confirm="onSearch"
				@reset="resetSearch"
			/>
		</div>
		<div class="global-page-main-wrap global-margin-top">
			<FTable
				ref="table"
				:columns="tableColumns"
				:params="searchForm"
				fullHeight
				url="/mock/list"
			/>
		</div>
		<!--新增修改基本信息-->
		<FDrawer
			destroy-on-close
			title="修改"
			:visible.sync="editFormVisible"
			:loading="isLoading"
			@cancle="cancelDialog('editFormVisible')"
			@confirm="submitForm"
		>
			<f-form
				label-width="80px"
				:model="editForm"
				:column="editFormConfig"
				hide-action
				ref="editForm"
			/>
		</FDrawer>
	</div>
</template>
<script>
import { tableConfig, editFormConfig, searchFormConfig } from './conf';
import { fetch } from '@/utils/request';
const defaultSearchForm = {
	paramName: '',
	status: '',
	paramType: 1,
};
const defaultEditForm = {
	paramCode: '',
	paramName: '',
	paramValue: '',
	remark: '',
	status: 1,
	paramType: 1,
};
export default {
	name: 'systemParameter',
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
			treeProps: {
				children: 'children',
				label: 'moduleName',
			},
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
			if (type === 'edit') {
				this.todoUpdate(row);
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
		// 修改
		todoUpdate(row) {
			this.editForm = { ...row };
			this.editFormVisible = true;
		},
		submitForm() {
			this.$refs['editForm'].validate(async (valid) => {
				if (valid) {
					this.isLoading = true;
					let { err } = await fetch({
						url: '/admin/fsop/param/config/edit',
						method: 'post',
						data: this.editForm,
					});
					this.isLoading = false;
					if (!err) {
						this.editFormVisible = false;
						this.$message({
							message: this.editForm.paramCode ? '修改成功' : '新增成功',
							type: 'success',
						});
						this.onSearch();
					}
				}
			});
		},
		cancelDialog(val) {
			this[val] = false;
		},
	},
};
</script>
<style lang="scss" scoped></style>
