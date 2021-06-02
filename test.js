// test.js

for (let i = 0; i < 100000; i++) {
  console.log(i);
}
document.getElementById("hello").innerHTML = "hello world";
function resolve() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('成功')
    }, 1000)
  })
}

function isTimeOut(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('超时')
    }, time)
  })
}
function repeatFetch(fn, count) {
  return fn()
    .catch((err) => {
      if(count === 0) {
        return Promise.reject(err)
      }
      return repeatFetch(fn, --count)
    })
}
function deFetch(fn, count, time) {
  return Promise.race([isTimeOut(time),repeatFetch(fn, count)])
}