const fs = require('fs');
const path = require('path')

const root = '/'
const dir = {
    '/': {
        path: '/',
        name: '根'
    }
}
async function print(name) {
    const dir = await fs.promises.opendir(path.resolve(__dirname+ name));
    for await (const dirent of dir) {
        if(!dir[name]) {
            dir[name] = {}
        }
        if(!dir[name].children){
            dir[name].children = []
        }
        dir[name].children.push({
            name: dirent.name,
            path: `${name}/${dirent.name}`,
            type: dirent.isFile() ? path.extname(path.resolve(root,dirent.name)) : 'dir'
        })
        if(dirent.isDirectory() && dirent.name !== 'node_modules'){
            await print(name+ '/'+dirent.name)
        }
        console.log(path.resolve(root,dirent.name), dirent.isFile(), path.extname(path.resolve(root,dirent.name))) ;
    }
    return dir
}
async function abc(){
    const tree = await print(root)
    console.log('path',JSON.stringify(tree))
}

abc()