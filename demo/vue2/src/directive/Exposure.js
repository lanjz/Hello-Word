// polyfill
import 'intersection-observer';

// 可以把节流的时间调大一点，默认是100ms
// IntersectionObserver.prototype['THROTTLE_TIMEOUT'] = 300;

export default class Exposure {
    constructor(validTime = 500) {
        // 当前收集的  尚未上报的数据  也就是已经进入视窗的DOM节点的数据
        this.temStore = new Map()
        this.timerOut = false;
        this.validTime = validTime
        this.localStorageKey = 'exp-data'
        // 全局只会实例化一次Exposure类，init方法也只会执行一次
        this.init();
    }

    init() {
        const self = this;
        // init只会执行一次，所以这两边界处理方法放这就行
        // 把浏览器localStorage里面的剩余数据打完
        this.dotFromLocalStorage();
        this._observer = new IntersectionObserver(function (entries, observer) {
            let curTime = new Date().getTime()
            entries.forEach(entry => {
                console.log(entry.isIntersecting, entry.target.getAttribute('data-des'))
                if (entry.isIntersecting) {
                    if(self.temStore.has(curTime)){
                        self.temStore.get(curTime).push(entry.target)
                    } else {
                        self.temStore.set(curTime, [entry.target])
                    }
                    if(!self.timerOut){
                        self.timerOut = true
                        window.setTimeout(function () {
                            self.timerOut = false
                            self.uploadDot();
                        }, 5000)
                    }

                } else {
                    for(let [key, value] of (self.temStore.entries())){
                        if(curTime - key < self.validTime){
                            for(let i = 0; i<value.length; i++){
                                if(value[i] === entry.target){
                                    value.splice(i, 1)
                                    break
                                }
                            }
                        } else {
                            break
                        }
                    }
                }
                self.storeIntoLocalstorage()
            })
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 0.3 // 不一定非得全部露出来  这个阈值可以小一点点
        });

    }
    uploadDot(){
        let data = []
        let curTime = new Date().getTime()
        for(let [key, value] of (this.temStore.entries())){
            if(curTime - key >= this.validTime){
                value.forEach(item => {
                    data.push({
                        des: item.getAttribute['data-des'],
                        time: key
                    })
                })
                this.temStore.delete(key)
            }
        }
        this.fetch(data)
        this.storeIntoLocalstorage()
    }
    fetch(data){
        if(!data.length) return
        console.log('fetch', data)
        // 上传
    }
    // 每个商品都会会通过全局唯一的Exposure的实例来执行该add方法,将自己添加进观察者中
    add(entry) {
        this._observer && this._observer.observe(entry.el)
    }
    storeIntoLocalstorage() {
        let  data = []
        for(let [key, value] of (this.temStore.entries())){
            value.forEach(item => {
                data.push({
                    des: item.getAttribute['data-des'],
                    time: key
                })
            })
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify(data))
    }

    dotFromLocalStorage() {
        const ctmsStr = window.localStorage.getItem(this.localStorageKey);
        if (ctmsStr) {
            this.fetch(JSON.parse(ctmsStr))
        }
        localStorage.removeItem(this.localStorageKey)
    }
}