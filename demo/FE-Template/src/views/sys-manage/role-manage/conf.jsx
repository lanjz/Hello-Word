import { listToEnum, parseTime } from '../../../utils';
const roleTypes = [
	{ label: '全部', value: '', render: 'el-option' },
	{ label: '系统管理员', value: 0, render: 'el-option' },
	{ label: '子管理员', value: 1, render: 'el-option' },
	{ label: '普通角色', value: 2, render: 'el-option' },
];
const roleTypesMap = listToEnum(roleTypes);

const status = [
	{ label: '有效', value: 1, render: 'el-option' },
	{ label: '无效', value: 0, render: 'el-option' },
];
const statusMap = listToEnum(status);

export const searchFormConfig = [
	{
		prop: 'roleName',
		label: '名称',
		render: 'el-input',
		placeholder: '请输入',
		clearable: true,
	},
	{
		prop: 'roleType',
		label: '角色类型',
		render: 'el-select',
		placeholder: '请选择',
		clearable: true,
		child: roleTypes,
	},
	{
		prop: 'status',
		label: '状态',
		render: 'el-select',
		placeholder: '请选择',
		clearable: true,
		child: [{ label: '全部', value: '', render: 'el-option' }, ...status],
	},
];
export const editFormConfig = function (isEdit) {
	return [
		{
			prop: 'roleCode',
			label: '编码',
			render: 'el-input',
			placeholder: '请输入编码',
			clearable: true,
			disabled: isEdit,
			itemFormAttr: {
				rules: [{ required: true, message: '请输入编码', trigger: 'blur' }],
			},
		},
		{
			prop: 'roleName',
			label: '名称',
			render: 'el-input',
			placeholder: '请输入名称',
			clearable: true,
			itemFormAttr: {
				rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
			},
		},
		{
			prop: 'roleType',
			label: '角色类型',
			render: 'el-select',
			placeholder: '请选择角色类型',
			clearable: true,
			child: roleTypes,
			itemFormAttr: {
				rules: [{ required: true, message: '请选择角色类型', trigger: 'blur' }],
			},
		},
		{
			prop: 'roleDesc',
			label: '备注',
			render: 'el-input',
			type: 'textarea',
			placeholder: '请输入备注',
			clearable: true,
		},
		{
			prop: 'status',
			label: '状态',
			render: 'el-select',
			placeholder: '请选择是否有效',
			clearable: true,
			child: status,
		},
	];
};
export function tableConfig(handleInTable) {
	return [
		{
			prop: 'roleCode', label: '编号', width: 160,
		},
		{ prop: 'roleName', label: '名称', width: 160 },
		{
			prop: 'roleType',
			label: '角色类型',
			width: 100,
			render: (h, { row }) => {
				return <span>{roleTypesMap[row.roleType] || ''}</span>;
			},
		},
		{
			prop: 'status',
			label: '状态',
			minWidth: 60,
			render: (h, { row }) => {
				return <span>{statusMap[row.status] || ''}</span>;
			},
		},
		{
			prop: 'createTime',
			label: '创建时间',
			width: 160,
			render: (h, scope) => {
				return <span>{parseTime(scope.row.createTime)}</span>;
			},
		},
		{ prop: 'createUser', label: '创建人', minWidth: 100 },
		{
			prop: 'updateTime',
			label: '修改时间',
			width: 160,
			render: (h, scope) => {
				return <span>{parseTime(scope.row.updateTime)}</span>;
			},
		},
		{ prop: 'updateUser', label: '修改人', minWidth: 100 },
		{ prop: 'roleDesc', label: '备注', minWidth: 200, opt: { 'show-overflow-tooltip': true } },
		{
			prop: 'operate',
			label: '操作',
			width: '160',
			opt: { fixed: 'right' },
			render: (h, scope) => {
				return (
					<div>
						<OperateItem
							onClick={() => handleInTable(scope, 'edit')}
							type="edit"
							text="修改"
						/>
						<OperateItem
							onClick={() => handleInTable(scope, 'auth')}
							type="tool"
							text="授权"
						/>
						<OperateItem
							onClick={() => handleInTable(scope, 'del')}
							type="del"
							text="删除"
						/>
					</div>
				);
			},
		},
	];
}
