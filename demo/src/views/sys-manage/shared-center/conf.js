import { listToEnum, parseTime } from '@/utils';

const status = [
	{ label: '全部', value: '', render: 'el-option' },
	{ label: '有效', value: 1, render: 'el-option' },
	{ label: '无效', value: 0, render: 'el-option' },
];
const statusMap = listToEnum(status);
const attributes = [
	{ label: '虚拟', value: 1, render: 'el-option' },
	{ label: '职能', value: 2, render: 'el-option' },
	{ label: '业务', value: 3, render: 'el-option' },
	{ label: '管理', value: 4, render: 'el-option' },
];
const attributesMap = listToEnum(attributes);

const shareCenterType = [
	{ label: '公司', value: 1, render: 'el-option' },
	{ label: '部门', value: 2, render: 'el-option' },
];
const shareCenterTypeMap = listToEnum(shareCenterType);
export const searchFormConfig = [
	{
		prop: 'sharedCenterName',
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
			prop: 'sharedCenterCode',
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
			prop: 'sharedCenterName',
			label: '名称',
			render: 'el-input',
			placeholder: '请输入名称',
			clearable: true,
			itemFormAttr: {
				rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
			},
		},
		{
			prop: 'parentName',
			label: '上级名称',
			render: 'el-input',
			placeholder: '请输入上级名称',
			clearable: true,
			itemFormAttr: {
				rules: [{ required: true, message: '请选择上级名称', trigger: 'blur' }],
			},
		},
		{
			prop: 'remark',
			label: '备注',
			render: 'el-input',
			type: 'textarea',
			placeholder: '',
			clearable: true,
		},
		{
			prop: 'status',
			label: '生效状态',
			render: 'el-select',
			placeholder: '请选择生效状态',
			clearable: true,
			child: status,
		},
	];
};
export function tableConfig(handleInTable, AUTHBTN) {
	return [
		{ prop: 'sharedCenterCode', label: '编号', width: 150 },
		{ prop: 'sharedCenterName', label: '名称', width: 160 },
		{ prop: 'parentName', label: '上级名称', width: 150 },
		{
			prop: 'sharedCenterType',
			label: '类型',
			width: 80,
			render: (h, { row }) => {
				return <span>{shareCenterTypeMap[row.sharedCenterType] || ''}</span>;
			},
		},
		{
			prop: 'sharedCenterAttr',
			label: '属性',
			width: 80,
			render: (h, { row }) => {
				return <span>{attributesMap[row.sharedCenterAttr] || ''}</span>;
			},
		},
		{
			prop: 'status',
			label: '状态',
			minWidth: 80,
			render: (h, { row }) => {
				return <span>{statusMap[row.status] || ''}</span>;
			},
		},
		{
			prop: 'startTime',
			label: '生效时间',
			width: 160,
			render: (h, scope) => {
				return <span>{parseTime(scope.row.startTime)}</span>;
			},
		},
		{
			prop: 'endTime',
			label: '失效时间',
			width: 160,
			render: (h, scope) => {
				return <span>{parseTime(scope.row.endTime)}</span>;
			},
		},
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
							onclick={() => handleInTable(scope, 'look')}
							type="look"
							text="详情"
							isAuth
							auth={AUTHBTN['tab_detail']}
						/>
					</div>
				);
			},
		},
	];
}
