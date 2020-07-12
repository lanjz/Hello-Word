const glob = require("glob");

function getEntry() {
    const entry = {};
    //读取src目录所有page入口
    glob.sync('../src/__*/index.js')
        .forEach(function (filePath) {
            console.log('filePath', filePath)
            var name = filePath.match(/\/(__.+)\/index.js/);
            console.log('name', name)
            name = name[1];
            entry[name] = filePath;
        });
    return entry;
  };
  console.log(glob.sync('../src/__*/index.js'))
  getEntry()
