import { listToEnum, parseTime } from '../../../utils';

const status = [
	{ label: '全部', value: '', render: 'el-option' },
	{ label: '有效', value: 1, render: 'el-option' },
	{ label: '无效', value: 0, render: 'el-option' },
];
const statusMap = listToEnum(status);

export const searchFormConfig = [
	{
		prop: 'paramName',
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
export const editFormConfig = function () {
	return [
		{
			prop: 'paramCode',
			label: '编码',
			render: 'el-input',
			placeholder: '请输入编码',
			clearable: true,
			disabled: true,
			itemFormAttr: {
				rules: [{ required: true, message: '请输入编码', trigger: 'blur' }],
			},
		},
		{
			prop: 'paramName',
			label: '名称',
			render: 'el-input',
			placeholder: '请输入名称',
			disabled: true,
			clearable: true,
			itemFormAttr: {
				rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
			},
		},
		{
			prop: 'paramValue',
			label: '参数值',
			render: 'el-input',
			placeholder: '请输入参数值',
			clearable: true,
			itemFormAttr: {
				rules: [{ required: true, message: '请输入参数值', trigger: 'blur' }],
			},
		},
		{
			prop: 'sharedCenterName',
			label: '共享中心',
			render: 'el-input',
			placeholder: '请输入共享中心',
			clearable: true,
			disabled: true,
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
			disabled: true,
			render: 'el-select',
			placeholder: '请选择是否有效',
			clearable: true,
			child: status,
		},
	];
};
export function tableConfig(handleInTable, AUTHBTN) {
	return [
		{ prop: 'paramCode', label: '编号', width: 100 },
		{ prop: 'paramName', label: '名称', width: 160, opt: { 'show-overflow-tooltip': true } },
		{ prop: 'paramValue', label: '参数值', width: 80 },
		{ prop: 'sharedCenterName', label: '共享中心', width: 150 },
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
		{ prop: 'createUser', label: '创建人', minWidth: 120 },
		{
			prop: 'updateTime',
			label: '更新时间',
			width: 160,
			render: (h, scope) => {
				return <span>{parseTime(scope.row.updateTime)}</span>;
			},
		},
		{ prop: 'updateUser', label: '更新人', minWidth: 120 },
		{ prop: 'remark', label: '备注', minWidth: 200, opt: { 'show-overflow-tooltip': true } },
		{
			prop: 'operate',
			label: '操作',
			width: '80',
			opt: { fixed: 'right' },
			render: (h, scope) => {
				return (
					<div>
						<OperateItem
							onclick={() => handleInTable(scope, 'edit')}
							type="edit"
							text="修改"
						/>
					</div>
				);
			},
		},
	];
}
