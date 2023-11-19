import {listToEnum, parseTime} from '../../../utils';
const status = [
	{ label: '全部', value: '', render: 'el-option' },
	{ label: '有效', value: 1, render: 'el-option' },
	{ label: '无效', value: 0, render: 'el-option' },
];
const statusMap = listToEnum(status);
const sourceTypes = [
	{ label: '平台创建', value: 0, render: 'el-option' },
	{ label: '顺丰帐号', value: 1, render: 'el-option' },
	{ label: '外部帐号', value: 2, render: 'el-option' },
];
const sourceTypesMap = listToEnum(sourceTypes);
const types = [
	{ label: '域用户', value: '1', render: 'el-option' },
	{ label: '非域用户', value: '0', render: 'el-option' },
];
const typesMap = listToEnum(types);
export function tableConfig(handleInTable) {
	return [
		{
			prop: 'selection',
			label: '',
			width: 45,
			opt: { type: 'selection', fixed: 'left' },
		},
		{
			prop: 'roleCode', label: '编号', width: 160,
		},
		{ prop: 'roleName', label: '名称', width: 160 },
		{
			prop: 'roleType',
			label: '角色类型',
			width: 100,
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
			width: 160,
			opt: { fixed: 'right' },
			render: (h, scope) => {
				const btns = [
					{ text: '修改', code: 'edit', isAuth: true },
					{ text: '授权', code: 'auth', isAuth: true },
				];
				if (scope.row.status === 1) {
					btns.unshift({ text: '失效', code: 'deactive' });
				} else if (scope.row.status === 0) {
					btns.unshift({ text: '生效', code: 'active' });
				}
				return (
					<div>
						<OperateGroup
							onClick={(key) => handleInTable(scope, key)}
							group={btns}
						/>
					</div>
				);
			},
		},
	];
}

export const searchFormConfig = [
	{
		prop: 'userName',
		label: '账号',
		render: 'el-input',
		placeholder: '请输入',
		clearable: true,
	},
	{
		prop: 'userNameCn',
		label: '名称',
		render: 'el-input',
		placeholder: '请输入',
		clearable: true,
	},
	{
		prop: 'status',
		label: '状态',
		render: 'el-select',
		placeholder: '请选择',
		clearable: true,
		child: status,
	},
];

export const editFormConfig = function (isEdit) {
	return [
		{
			prop: 'userName',
			label: '账号',
			render: 'el-input',
			placeholder: '请输入账号',
			clearable: true,
			disabled: isEdit,
			itemFormAttr: {
				rules: [{ required: true, message: '请输入账号', trigger: 'blur' }],
			},
		},
		{
			prop: 'userNameCn',
			label: '名称',
			render: 'el-input',
			placeholder: '请输入名称',
			clearable: true,
			itemFormAttr: {
				rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
			},
		},
		{
			prop: 'typeCode',
			label: '用户类型',
			render: 'el-select',
			placeholder: '请选择用户类型',
			clearable: true,
			child: types,
			itemFormAttr: {
				rules: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
			},
		},
		{
			prop: 'sourceType',
			label: '账号来源',
			render: 'el-select',
			placeholder: '请选择账号来源',
			clearable: true,
			child: sourceTypes,
			itemFormAttr: {
				rules: [{ required: true, message: '请选择账号来源', trigger: 'blur' }],
			},
		},
		{
			prop: 'remark',
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
			child: [
				{ label: '有效', value: 1, render: 'el-option' },
				{ label: '无效', value: 0, render: 'el-option' },
			],
		},
	];
};
