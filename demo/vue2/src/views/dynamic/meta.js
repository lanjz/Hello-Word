const searchMeta = {
    render: 'DSearch',
    searchFormConfig: [
        {
            prop: 'dicKey',
            label: '编码',
            render: 'el-input',
            placeholder: '请输入',
            clearable: true,
        },
        {
            prop: 'dicName',
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
            child: [
                { label: '全部', value: '', render: 'el-option' },
                { label: '有效', value: 1, render: 'el-option' },
                { label: '无效', value: 0, render: 'el-option' },
            ],
        },
    ]
};
const actionMeta = {
    render: 'DAction',
    actions: [
        {
            prop: 'add',
            label: '添加',
            icon: 'el-icon-plus',
            eventTarget: ['d-dialog-form-event', 'open']
        },
        {
            prop: 'dicName',
            label: '删除',
            icon: 'el-icon-delete'
        },
    ],
};
const tableMeta = {
    render: 'DTable',
    tableUrl: '/list',
    tableConfig: [
        {
            prop: 'dicKey',
            label: '编码',
            width: 200,
        },
        {
            prop: 'dicName',
            label: '名称',
            width: 140,
        },
        { prop: 'dicValue', label: '值', width: 200 },
        { prop: 'sort', label: '顺序号', width: 100 },
        {
            prop: 'status',
            label: '状态',
            width: 80,
        },
        { prop: 'createTime', label: '创建时间', width: 160 },
        {
            prop: 'updateTime',
            label: '更新时间',
            width: 160,
        },
        { prop: 'remark', label: '备注', minWidth: 200, opt: { 'show-overflow-tooltip': true } },
    ]
};
const editFormMeta = {
    render: 'DDialogForm',
    editFormConfig: [
        {
            prop: 'dicKey',
            label: '编码',
            render: 'el-input',
            placeholder: '请输入编码',
            clearable: true,
            itemFormAttr: {
                rules: [{ required: true, message: '请输入编码', trigger: 'blur' }],
            },
        },
        {
            prop: 'dicName',
            label: '名称',
            render: 'el-input',
            placeholder: '请输入名称',
            clearable: true,
            itemFormAttr: {
                rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
            },
        },
        {
            prop: 'dicValue',
            label: '值',
            render: 'el-input',
            placeholder: '请输入值',
            clearable: true,
            itemFormAttr: {
                rules: [{ required: true, message: '请输入值', trigger: 'blur' }],
            },
        },
        {
            prop: 'sort',
            label: '顺序号',
            render: 'el-input',
            placeholder: '请输入顺序号',
            clearable: true,
            itemFormAttr: {
                rules: [{ required: true, message: '请输入顺序号', trigger: 'blur' }],
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
    ],
}
export default [
    searchMeta,
    actionMeta,
    tableMeta,
    editFormMeta
]