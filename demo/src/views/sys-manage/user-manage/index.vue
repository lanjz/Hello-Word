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
		<div class="global-action-wrap">
			<c-button
				@click="todoAdd()"
				type="primary"
				isAuth
				:auth="AUTHBTN['create']"
			>
				新增
			</c-button>
			<c-button
				class="has-icon"
				type="primary"
				plain
				@click="todoRemoveAuth()"
				isAuth
				:auth="AUTHBTN['cal_auth']"
				>取消授权
			</c-button>
		</div>
		<div class="global-page-main-wrap h-0 global-flex-1">
			<FTable
				@selection-change="handleSelectionChange"
				fullHeight
				ref="table"
				:columns="tableColumns"
				:postData="searchForm"
				method="post"
				url="/admin/tsUser/userData"
			/>
		</div>
		<!--新增修改基本信息-->
		<FDrawer
			@cancle="cancelDialog('editFormVisible')"
			@confirm="submitForm"
			:visible="editFormVisible"
			:loading="isLoading"
			destroy-on-close
			:title="isEdit ? '修改用户' : '新增用户'"
		>
			<f-form
				label-width="80px"
				:model="editForm"
				:column="editFormConfig"
				hide-action
				ref="editForm"
			/>
		</FDrawer>
		<!--授权弹窗-->
		<FDrawer
			:title="authModalName"
			:visible.sync="authorizationVisible"
			destroy-on-close
			width="600px"
			:loading="isLoading"
			@cancle="cancelDialog('authorizationVisible')"
			@confirm="authorizationSave"
		>
			<div
				v-if="authorizationVisible"
				style="height: 100%"
			>
				<DataAccess
					:list="accessList"
					:selected="accessSelect"
					:tarName="editForm.userNameCn"
					:authName="authName"
					ref="refDataAccess"
				/>
			</div>
		</FDrawer>
	</div>
</template>
<script>
import { Message, Loading } from 'element-ui';
import { tableConfig, searchFormConfig, editFormConfig } from './conf';
import userManageApi from '@/api/app/user-manage';
import { fetch } from '@/utils/request';
import DataAccess from './data-access';
const defaultEditForm = {
	authType: 'LOCAL',
	sourceType: 0,
	status: 1,
	typeCode: '1',
	userName: '',
	userNameCn: '',
	remark: '',
};
const defaultSearch = {
	userName: '',
	userNameCn: '',
	status: '',
};
export default {
	name: 'userManage', // 角色管理
	components: { DataAccess },
	data() {
		return {
			// 搜索
			tableColumns: tableConfig(this.handleInTable, this.AUTHBTN),
			searchFormConfig,
			searchForm: { ...defaultSearch },
			// 编辑修改
			isEdit: false,
			editForm: { ...defaultEditForm },
			editFormVisible: false,
			selectItem: [],
			// 授权
			accessSelect: [],
			accessList: [],
			authorizationVisible: false,
			dataAccessSingle: false,
			authModalName: '',
			// 组织
			isLoading: false,
			authName: '',
		};
	},

	computed: {
		editFormConfig() {
			return editFormConfig(this.isEdit);
		},
	},
	mounted() {},
	methods: {
		handleInTable({ row }, type) {
			this.dataAccessSingle = false;
			if (type === 'edit') {
				this.todoUpdate(row);
			} else if (['deactive', 'active'].includes(type)) {
				this.toggleStatus(row, type);
			} else if (type === 'auth') {
				this.authName = '角色列表';
				this.authModalName = '角色授权';
				this.dataAccessSingle = true;
				this.todoAuthRole(row);
			}
		},
		async todoAuthRole(row) {
			let { err, data: response } = await fetch({
				method: 'post',
				url: '/admin/roleManage/roleList',
				data: {},
			});
			if (!err) {
				this.editForm = row;
				this.accessList = response.data.map((item) => ({ ...item, text: item.roleName, code: item.roleId }));
				let hasAuthRed = await fetch({
					method: 'post',
					url: '/admin/tsUserRole/selectUserRole',
					data: {
						userId: row.userId,
					},
				});
				if (!hasAuthRed.err) {
					this.accessSelect = hasAuthRed.data.data.map((item) => item.roleId);
				}
				// this.accessSelect = (row.roleGroupCode || '').split(',');
			}
			this.authorizationVisible = true;
		},
		async authorizationSave() {
			const getCheckNodes = this.$refs.refDataAccess.getChecked();
			const getCheckKeys = getCheckNodes.map((item) => item.code);
			this.isLoading = true;
			let { err } = await userManageApi.roleAuth({
				userId: this.editForm.userId,
				userRoles: getCheckKeys.map((item) => ({ roleId: item })),
			});
			this.isLoading = false;
			if (!err) {
				this.onSearch();
				Message({
					message: '保存成功',
					type: 'success',
				});
				this.authorizationVisible = false;
			}
		},
		resetSearch() {
			this.searchForm = {
				...defaultSearch,
			};
		},
		onSearch() {
			this.$refs.table.getEl().clearSelection();
			this.$refs.table.reFetchData();
		},
		todoDelete(row) {
			this.$confirm('确定要删除该用户', '确认删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			})
				.then(async () => {
					let loadingInstance = Loading.service({ fullscreen: true });
					let { err } = await userManageApi.delete({
						userId: row.userId,
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
		async toggleStatus(row, type) {
			const text = type === 'deactive' ? '失效' : '生效';
			this.$confirm(`确定要${text}帐号吗`, '确认' + text, {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			})
				.then(async () => {
					this.isLoading = true;
					const params = {
						userName: row.userName,
					};
					let { err } = await (type === 'deactive' ? userManageApi.disableUser(params) : userManageApi.enableUser(params));
					this.isLoading = false;
					if (!err) {
						this.editFormVisible = false;
						this.$message(
							{
								message: text + '成功',
								type: 'success',
							},
							{
								loading: '',
							}
						);
						this.onSearch();
					}
				})
				.catch(() => {});
		},
		handleSelectionChange(val) {
			this.selectItem = val;
		},
		async todoRemoveAuth() {
			// eslint-disable-next-line no-unreachable
			if (!this.selectItem || !this.selectItem.length) {
				this.$message.warning('请选择一条数据再进行操作');
				return;
			}
			this.$confirm(`确定要取消授权吗`, '确认取消授权', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			})
				.then(async () => {
					this.isLoading = true;
					let { err } = await userManageApi.removeAuth({
						userName: this.selectItem.map((item) => item.userName).join(','),
					});
					this.isLoading = false;
					if (!err) {
						this.editFormVisible = false;
						this.$message(
							{
								message: '取消授权成功',
								type: 'success',
							},
							{
								loading: '',
							}
						);
						this.onSearch();
					}
				})
				.catch(() => {});
		},
		// 修改
		todoUpdate(row) {
			this.isEdit = true;
			const editForm = {
				userId: row.userId,
			};
			Object.keys(defaultEditForm).forEach((item) => {
				editForm[item] = row[item];
			});
			this.editForm = { ...row };
			this.editFormVisible = true;
		},
		todoAdd() {
			this.isEdit = false;
			this.editForm = { ...defaultEditForm };
			this.editFormVisible = true;
		},
		submitForm() {
			this.$refs['editForm'].validate(async (valid) => {
				if (valid) {
					this.isLoading = true;
					let fetchApi = this.isEdit ? userManageApi.put : userManageApi.get;
					let { err } = await fetchApi(this.editForm);
					this.isLoading = false;
					if (!err) {
						this.editFormVisible = false;
						this.$message({
							message: this.isEdit ? '编辑成功' : '新增成功',
							type: 'success',
						});
						this.cancelDialog('editFormVisible');
						this.onSearch();
					}
				}
			});
		},
		cancelDialog(val) {
			this[val] = false;
		},
		destToText(obj) {
			return obj.map((item) => ({ ...item, text: item.desc }));
		},
	},
};
</script>
<style lang="scss" scoped></style>
