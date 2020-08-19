const fs = require('fs');
const { Readable } = require('stream')
const { Writable } = require('stream');
// 使用流创建文件
function createStreamFile(){
    const fs = require('fs');
    const file = fs.createWriteStream('./files/big.file');
    for(let i=0; i<= 1e6; i++) {
        file.write(i+':Lorem\n');
    }
    file.end();
}

// 读取可读流
function streamRead() {
    const startTime = new Date()
    //创建一个文件可读流
    let rs = fs.createReadStream('./files/big.file', {
        //文件系统标志
        flags: 'r',
        //数据编码，如果调置了该参数，则读取的数据会自动解析
        //如果没调置，则读取的数据会是 Buffer
        //也可以通过 rs.setEncoding() 进行设置
        encoding: 'utf8',
        //文件描述符，默认为null
        fd: null,
        //文件权限,
        mode: 0o666,
        //文件读取的开始位置
        start: 0,
        //文件读取的结束位置(包括结束位置)
        end: Infinity,
        //读取缓冲区的大小，默认64K
        // highWaterMark: 3
    });
    
    //文件被打开时触发
    rs.on('open', function () {
        console.log('文件打开');
    });
    
    //监听data事件，会让当前流切换到流动模式
    //当流中将数据传给消费者后触发
    //由于我们在上面配置了 highWaterMark 为 3字节，所以下面会打印多次。
    rs.on('data', function (data) {
        console.log(data);
    });
    
    //流中没有数据可供消费者时触发
    rs.on('end', function () {
        console.log('数据读取完毕', new Date() - startTime);
    });
    
    //读取数据出错时触发
    rs.on('error', function () {
        console.log('读取错误');
    });
    
    //当文件被关闭时触发
    rs.on('close', function () {
        console.log('文件关闭');
    });
    // 1秒后暂停读取， 再过2秒继续读以数据
    setTimeout(function () {
        rs.pause()
        setTimeout(function(){
            rs.resume()
        }, 2000)
    }, 1000);
  
}

// 使用Readable创建一个可读流

function createReadableStream(){
    const inStream = new Readable()
    inStream.on('close', function () {
        console.log('open')
    })
    inStream.push('13345')
    inStream.push('abcd')
    inStream.push(null)
    inStream.pipe(process.stdout)
}

function createReadableStream2(){

    const inStream = new Readable({
        read(size) {
            console.log('size', size)
            this.push(String.fromCharCode(this.currentCharCode++));
            if (this.currentCharCode > 90) {
                this.push(null);
            }
        }
    });

    inStream.currentCharCode = 65

    inStream.pipe(process.stdout);
}

// 可写流
function createWriteStreamFile(){
    const outStream = new Writable({
        write(chunk, encoding, callback) {
            console.log(chunk.toString());
            if(chunk.toString() === 'z'){
                outStream.end()
            }
            callback();
        }
    });
    outStream.on('drain',function(){
        console.log('drain')
    })
    outStream.on('finish',function(){
        console.log('finish')
    })
    const outFile = fs.createWriteStream('./files/test.txt')
    outFile.on('drain',function(){
        console.log('drain')
    })
    outFile.on('finish',function(){
        console.log('finish')
    })
    let rs = fs.createReadStream('./files/big.file')
    rs.pipe(outFile);
}
module.exports = {
    createWriteStreamFile,
    createReadableStream,
    createReadableStream2,
    streamRead,
    createStreamFile
}