

function getListData(start=1){
    const listData = []
    for(let i = start; i<(start+20); i++){
        listData.push({
            roleCode: 'roleCode' + i,
            roleName: 'roleName' + i,
            createUser: 'createUser' + i,
            updateUser: 'updateUser' + i,
            roleDesc: 'roleDesc' + i,
            roleType: 1,
            status: 2,
            createTime: new Date().getTime(),
            updateTime: new Date().getTime(),
        })
    }
    return listData
}
function mockTreeData(deep = 3){
    let createTree = (deep = 3) => {
        const listData = []
        const len = Math.ceil(Math.random()*10 + 2)
        for(let i = 0; i<len; i++){
            listData.push({
                moduleCode: 'moduleCode' + deep + i,
                moduleName: 'moduleName' + deep + i,
                label: 'label' + deep + i,
                moduleId: 'moduleId' + deep + i,
                parentName: 'parentName' + deep + i,
                children: deep >=0 ? createTree(deep-1): []
            })
        }
        return listData
    }
    const res = createTree()
    return {
        data: res
    }

}
export function mockTableData(options){
    const { data = {}, params = {} } = options
    const start = data.pageNum || params.pageNum
    return {
        data: {
            data: {
                list: getListData(start),
                totalSize: 100
            }
        } }
}
export function mockData(options){
    switch (options.url) {
        case '/mock/list':
            return mockTableData(options)
        case '/mock/tree':
            return mockTreeData(options)
    }
}