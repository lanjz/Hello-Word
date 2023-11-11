<template>
	<div class="global-container-wrap global-flex">
		<!--模块树形结构-->
		<div class="left global-shrink global-flex-column">
			<div class="panel-title">
				<span class="title">{{ systemName }}</span>
				<c-button
					type="primary"
					@click="todoAdd()"
					isAuth
					:auth="AUTHBTN['create']"
				>
					添加
				</c-button>
			</div>
			<div class="global-flex-1 scroll">
				<el-tree
					class="data-tree"
					ref="tree"
					:data="treeData[0] ? treeData[0].children : []"
					node-key="moduleCode"
					:check-strictly="true"
					@node-click="handleNodeClick"
					@node-expand="nodeExpand"
					@node-collapse="nodeCollapse"
					:highlight-current="true"
					:expand-on-click-node="true"
					v-loading="loading"
					:props="defaultProps"
					:default-expanded-keys="defaultExpandedArr"
				>
					<div
						class="custom-tree-node clear"
						slot-scope="{ node, data }"
					>
						<span>{{ node.label }}</span>
						<span>
							<i
								class="el-icon-delete global-warning"
								style="font-size: 15px; padding: 0 5px"
								type="text"
								@click.stop="deleteItem(node, data)"
							/>
							<i
								class="el-icon-plus global-primary"
								v-if="data.moduleType === 3"
								style="font-size: 15px; padding: 0 5px"
								type="text"
								@click.stop="todoAdd(data)"
							></i>
						</span>
					</div>
				</el-tree>
			</div>
		</div>
		<div class="right global-flex-1 scroll">
			<FEmpty
				text="请先选择模块"
				top="120"
				v-if="!moduleForm.moduleCode && !moduleForm.parentId"
			></FEmpty>
			<template v-else>
				<div class="panel-title">{{ isAdd ? '新增' : '编辑' }}模块</div>
				<div class="border-box right">
					<div class="parent-info">
						<span v-if="isAdd">所属父级：{{ moduleForm.parentName || systemName }}</span>
					</div>
					<el-form
						:rules="rules"
						label-position="left"
						:inline="false"
						:model="moduleForm"
						ref="moduleFormRef"
						class="c-form"
						label-width="100px"
					>
						<el-form-item
							label="编码"
							prop="moduleCode"
						>
							<el-input
								v-model="moduleForm.moduleCode"
								placeholder="请输入编码"
							></el-input>
						</el-form-item>
						<el-form-item
							label="模块名称"
							prop="moduleName"
						>
							<el-input
								v-model="moduleForm.moduleName"
								placeholder="请输入模块名称"
							></el-input>
						</el-form-item>
						<el-form-item label="图标样式">
							<el-input
								v-model="moduleForm.moduleIcon"
								placeholder="请输入图标样式"
							></el-input>
						</el-form-item>
						<el-form-item
							label="模块类型"
							prop="moduleType"
						>
							<el-select
								v-model="moduleForm.moduleType"
								placeholder="请选择模块类型"
							>
								<el-option
									v-for="item in moduleTypeDic"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>

						<el-form-item
							label="顺序号"
							prop="sort"
						>
							<el-input
								v-model.number="moduleForm.sort"
								placeholder="请输入顺序号"
							></el-input>
						</el-form-item>
						<el-form-item
							label="是否隐藏"
							prop="hidden"
						>
							<template>
								<el-radio
									v-model="moduleForm.hidden"
									label="N"
									>否</el-radio
								>
								<el-radio
									v-model="moduleForm.hidden"
									label="Y"
									>是</el-radio
								>
							</template>
						</el-form-item>
						<el-form-item
							label="新功能预告"
							prop="isPredevFlag"
						>
							<template>
								<el-radio
									v-model="moduleForm.isPredevFlag"
									label="N"
									>否</el-radio
								>
								<el-radio
									v-model="moduleForm.isPredevFlag"
									label="Y"
									>是</el-radio
								>
							</template>
						</el-form-item>
						<el-form-item
							label="预告提示"
							v-if="moduleForm.isPredevFlag === 'Y'"
						>
							<el-input
								v-model="moduleForm.predeveTips"
								placeholder="请输入功能URL"
							></el-input>
						</el-form-item>
						<el-form-item label="功能URL">
							<el-input
								v-model="moduleForm.actionUrl"
								placeholder="请输入功能URL"
							></el-input>
						</el-form-item>
						<el-form-item
							label="模块描述"
							prop="moduleDesc"
						>
							<el-input
								type="textarea"
								:rows="2"
								v-model="moduleForm.moduleDesc"
								placeholder="请输入模块描述"
							></el-input>
						</el-form-item>
						<el-form-item>
							<div class="tip-text">保存成功需要刷新页面才可生效</div>
							<CButton
								type="primary"
								icon-type="save"
								v-loading.fullscreen.lock="loading"
								@click.prevent="submitUpdate"
								isAuth
								:auth="AUTHBTN['save']"
								>保存</CButton
							>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import moduleApi from '@/api/app/module';
const baseForm = {
	parentId: '',
	moduleDesc: '',
	moduleCode: '',
	moduleName: '',
	moduleIcon: '',
	moduleType: '',
	hidden: 'N',
	isPredevFlag: 'N',
	actionUrl: '',
	sort: '',
	// 以下跟接口无关
	parentName: '',
	appType: 1,
	predeveTips: '正在研发中，敬请期待！',
};
export default {
	name: 'moduleManage', // 功能列表
	data() {
		return {
			moduleForm: { ...baseForm },
			rules: Object.freeze({
				moduleCode: [{ required: true, message: '请输入模块编码', trigger: 'blur' }],
				moduleName: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
				moduleType: [{ required: true, message: '请选择模块类型', trigger: 'change' }],
				hidden: [{ required: true, message: '请选择是否隐藏', trigger: 'change' }],
				sort: [
					{ required: true, message: '请输入顺序号' },
					{ type: 'number', message: '请输入数字' },
				],
			}),
			moduleTypeDic: Object.freeze([
				{ value: 3, label: '菜单目录' },
				{ value: 4, label: '按钮权限' },
			]),
			loading: false,
			treeData: [],
			defaultProps: {
				children: 'children',
				label: 'moduleName',
			},
			defaultExpandedArr: [],
			isAdd: false,
		};
	},
	computed: {
		systemName() {
			return (this.treeData[0] && this.treeData[0].moduleName) || '共享作业数字化平台';
		},
	},
	mounted() {
		this.searchModuleNode();
	},
	methods: {
		nodeExpand(data) {
			this.defaultExpandedArr.push(data.moduleCode);
		},
		nodeCollapse(data) {
			let ind = this.defaultExpandedArr.findIndex((item) => item === data.moduleCode);
			if (ind > -1) {
				this.defaultExpandedArr.splice(ind, 1);
			}
		},
		//删除
		deleteItem(node, data) {
			this.$confirm('确定删除模块吗', '确认删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			})
				.then(() => {
					this.httpDeleteItem(node, data);
				})
				.catch(() => {});
		},
		async httpDeleteItem(node, module) {
			const param = {
				id: module.moduleId,
			};
			let { err } = await moduleApi.delete(param);
			if (!err) {
				this.$message({
					message: '删除成功',
					type: 'success',
				});
				this.nodeCollapse(param);
				let getCurrentKey = this.$refs.tree.getCurrentKey();
				this.searchModuleNode(getCurrentKey);
				// 如果删除的是当前选中模块
				if (param.moduleCode === getCurrentKey) {
					this.moduleForm = {
						...baseForm,
					};
				}
			}
		},
		handleNodeClick(data) {
			this.isAdd = false;
			this.moduleForm = {
				...data,
				appType: 1,
			};
			this.$nextTick(() => {
				this.$refs.moduleFormRef.clearValidate();
			});
		},
		// 新增子系统
		todoAdd(data = this.treeData[0]) {
			if (!data || !data.moduleCode) {
				return;
			}
			this.isAdd = true;
			this.moduleForm = {
				...baseForm,
				parentId: data.moduleId,
				parentName: data.moduleName,
			};
			this.$nextTick(() => {
				this.$refs.moduleFormRef && this.$refs.moduleFormRef.clearValidate();
			});
		},
		/* 修改子系统或者子模块 */
		submitUpdate() {
			this.$refs['moduleFormRef'].validate(async (valid) => {
				if (valid) {
					this.loading = true;
					let { err } = this.moduleForm.moduleId ? await moduleApi.put(this.moduleForm) : await moduleApi.add(this.moduleForm);
					this.loading = false;
					if (!err) {
						this.$message({
							message: '添加成功',
							type: 'success',
						});
						this.handleNodeClick(this.moduleForm);
						this.searchModuleNode(this.moduleForm.moduleCode);
					}
				}
			});
		},
		async searchModuleNode(moduleCode = null) {
			this.loading = true;
			let { err, data: response } = await moduleApi.get();
			this.loading = false;
			if (!err) {
				this.treeData = response.data;
				this.$nextTick(() => {
					this.$refs.tree.setCurrentKey(moduleCode);
				});
			}
		},
	},
};
</script>
<style scoped lang="scss">
.panel-title {
	padding-bottom: 5px;
	border-bottom: 1px solid #e9edf0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	margin-bottom: 10px;
}
.title {
	color: $--color-primary;
}
.parent-info {
	height: 25px;
	padding-left: 20px;
	color: $--color-primary;
	font-size: 14px;
}
.tip-text {
	font-size: 13px;
	color: #909399;
}
.left {
	padding-right: 10px;
	width: 470px;
	border-right: 1px solid rgba(148, 149, 204, 90%);
	.moduleManges {
		height: 36px;
		background: #fff;
		label {
			margin-left: 10px;
			line-height: 36px;
			font-size: 14px;
		}
		.el-icon-plus {
			float: right;
			line-height: 36px;
			font-size: 10px;
			margin-right: 14px;
			cursor: pointer;
		}
	}
	.data-tree {
		height: auto;
		background: transparent;
		font-size: 14px;
		::v-deep .el-tree-node__content {
			line-height: 36px;
			height: 36px;
		}
		::v-deep .el-tree-node__content > .el-tree-node__expand-icon:not(.is-leaf) {
			font-size: 14px;
			color: #2a323e;
		}
		::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
			background-color: #fff !important;
			color: $--color-primary !important;
		}
		.custom-tree-node {
			width: 100%;
			> span:first-child {
				display: inline-block;
				width: calc(100% - 100px);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				vertical-align: bottom;
			}
			> span:last-child {
				float: right;
			}
			.el-icon-delete {
				margin-right: 10px;
				font-size: 13px;
				cursor: pointer;
			}
			.el-icon-plus {
				margin-right: 10px;
				font-size: 12px;
				cursor: pointer;
			}
		}
	}
}
.right {
	padding-left: 10px;
}
</style>
