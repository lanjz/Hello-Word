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
		<div class="global-action-wrap">
			<c-button
				type="primary"
				@click="todoAdd()"
				isAuth
				:auth="AUTHBTN['carete']"
			>
				新增
			</c-button>
		</div>
		<div class="global-page-main-wrap h-0 global-flex-1">
			<FTable
				ref="table"
				:columns="tableColumns"
				:postData="searchForm"
				method="post"
				fullHeight
				url="/admin/roleManage/roleData"
			/>
		</div>
		<!--新增修改基本信息-->
		<FDrawer
			destroy-on-close
			:title="!editForm.roleId ? '新增角色' : '修改角色'"
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
		<!--菜单授权弹窗-->
		<FDrawer
			destroy-on-close
			title="角色授权"
			:loading="isLoading"
			:visible.sync="authorizationVisible"
			@cancle="cancelDialog('authorizationVisible')"
			@confirm="authorizationSave"
		>
			<div style="min-height: 200px">
				<el-tree
					show-checkbox
					:data="authorizationData"
					:props="treeProps"
					ref="authTree"
					node-key="moduleId"
					:default-expanded-keys="defaultExpandedKeys"
					:default-checked-keys="authChecked"
				/>
			</div>
		</FDrawer>
	</div>
</template>
<script>
import { Message, Loading } from 'element-ui';
import { tableConfig, editFormConfig, searchFormConfig } from './conf';
import { fetch } from '@/utils/request';
const defaultSearchForm = {
	roleName: '',
	roleType: '',
	status: '',
};
const defaultEditForm = {
	roleCode: '',
	roleName: '',
	roleType: 2,
	roleDesc: '',
	status: 1,
};
export default {
	name: 'roleManage',
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
			// 授权
			authChecked: [],
			treeProps: {
				children: 'children',
				label: 'moduleName',
			},
			authorizationData: [],
			authorizationVisible: false,
			defaultExpandedKeys: [],
			isEdit: false,
			isLoading: false,
		};
	},
	computed: {
		editFormConfig() {
			return editFormConfig(this.isEdit);
		},
	},
	mounted() {},
	methods: {
		getCheckedNode(data = [], isChecked = []) {
			let checked = [];
			let walk = (list) => {
				list.forEach((item) => {
					if (item.children && item.children.length) {
						walk(item.children);
					} else {
						if (isChecked.includes(item.moduleId)) {
							checked.push(item.moduleId);
						}
					}
				});
			};
			walk(data);
			return checked;
		},
		handleInTable({ row }, type) {
			if (type === 'edit') {
				this.todoUpdate(row);
			} else if (type === 'del') {
				this.todoDeleteRole(row);
			} else if (type === 'auth') {
				this.todoAuthorization(row);
			}
		},
		async queryRoleModule(row) {
			let { err, data } = await fetch({
				url: '/admin/module/queryListByRoleIdForGrant',
				method: 'post',
				data: { roleId: row.roleId },
			});
			if (!err) {
				const { checkedIDs, modules } = data.data;
				const body = modules;
				this.authChecked = checkedIDs;
				this.authorizationData = body;
				if (this.authorizationData && this.authorizationData.length) {
					this.defaultExpandedKeys = [this.authorizationData[0].moduleId];
				}
				this.authorizationVisible = true;
			}
		},

		/**
		 * 使用深度优先遍历查找 filterKey = filterValue 的数据
		 * @author：zmy
		 * @pramas { Array<Tree> } arr 需要遍历的TREE对象 必填
		 * @pramas { String } key 被记录的属性
		 * @pramas { String } filterKey  过滤条件属性
		 * @pramas { any } filterValue 过滤值
		 */
		depthSearchFromTree(arr, key, filterKey, filterValue) {
			const result = [];
			const search = (data) => {
				if (filterKey && filterValue) {
					if (data[filterKey] === filterValue) {
						result.push(data[key]);
					}
				} else {
					result.push(data[key]);
				}

				data.children && data.children.forEach((child) => search(child));
			};
			arr.forEach((item) => {
				search(item);
			});
			return result.join(',');
		},
		todoAuthorization(row) {
			this.queryRoleModule(row);
			this.editForm = row;
		},
		async authorizationSave() {
			const getCheckNodes = this.$refs.authTree.getCheckedNodes(false, true);
			const getCheckKeys = getCheckNodes.map((item) => item.moduleId);
			this.isLoading = true;
			let { err } = await fetch({
				url: '/admin/tsRoleModule/saveRoleModule',
				method: 'post',
				data: {
					roleId: this.editForm.roleId,
					moduleList: getCheckKeys.join(';'),
				},
			});
			this.isLoading = false;
			if (!err) {
				Message({
					message: '保存成功',
					type: 'success',
				});
				this.authorizationVisible = false;
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
		todoDeleteRole(row) {
			this.$confirm('确定要删除该角色', '确认删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			})
				.then(async () => {
					let loadingInstance = Loading.service({ fullscreen: true });
					let { err } = await fetch({
						url: '/admin/roleManage/deleteByPrimaryKey',
						method: 'post',
						data: {
							roleId: row.roleId,
						},
					});
					loadingInstance.close();
					if (!err) {
						this.$message({
							message: '删除成功',
							type: 'success',
						});
						this.onSearch();
					}
				})
				.catch(() => {});
		},
		// 修改
		todoUpdate(row) {
			this.isEdit = true;
			this.editForm = { ...row };
			this.editFormVisible = true;
		},
		todoAdd() {
			this.isEdit = false;
			this.editForm = {
				...defaultEditForm,
			};
			this.editFormVisible = true;
		},
		submitForm() {
			this.$refs['editForm'].validate(async (valid) => {
				if (valid) {
					this.isLoading = true;
					let { err } = await fetch({
						url: '/admin/roleManage/saveRole',
						method: 'post',
						data: this.editForm,
					});
					this.isLoading = false;
					if (!err) {
						this.editFormVisible = false;
						this.$message({
							message: this.editForm.roleId ? '修改成功' : '新增成功',
							type: 'success',
						});
						this.onSearch();
					}
				}
			});
		},
		cancelDialog(val) {
			this[val] = false;
			this.authorizationData = [];
		},
	},
};
</script>
<style lang="scss" scoped></style>
