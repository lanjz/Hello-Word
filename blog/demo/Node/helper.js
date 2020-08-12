function delay(time){
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('延时：', time)
            resolve()
        }, time * 1000)
    })
}
function fibonacci(n) {
    if (n == 1 || n == 2) {
        return 1
    };
    return fibonacci(n - 2) + fibonacci(n - 1);
}

module.exports = {
    delay,
    fibonacci
}