// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "beginWork") {
        // 执行开始工作的逻辑
        beginWork();
    } else if (request.action === "stopWork") {
        // 执行停止工作的逻辑
        stopWork();
    }
});

let prePathName = ''
let isRunning = false
function closeZzzShowLog() {
    alert('接单脚本已退出，可回到接单页面再次启动')
    let el = document.querySelector('.zzzKLog')
    if(el){
        el.style.display = 'none'
    }
}
function beginWork() {
    if(isRunning) return
    isRunning = true
    prePathName = window.location.pathname
    let count = 0
    let runCount = 0
    const d = new Date()
    const curTime = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    function zzzShowLog(text, err){
        if(!isRunning) return
        let el = document.querySelector('.zzzKLog')
        if(el) {
            el.style.display = 'block'
        }
        if(!el) {
            el = document.createElement('div')
            el.classList.add('zzzKLog')
            el.style.position = 'fixed'
            el.style.background = '#fff'
            el.style.border = 'solid 2px #000'
            el.style.fontSize = '15px'
            el.style.padding = '20px'
            el.style.bottom = '10px'
            el.style.left= '10px'
            el.style.borderRadius = '10px'
            el.style.zIndex= '9999'
            el.style.color= err ? 'red': '#000'
            document.body.appendChild(el)
            const titleEl = document.createElement('p')
            titleEl.innerText = `运行时间：` + curTime
            titleEl.style.fontSize='13px'
            titleEl.style.color='#666'
            titleEl.style.padding='0 0 14px 0'
            el.appendChild(titleEl)

            const countEl = document.createElement('div')
            countEl.classList.add('zzzCountEl')
            countEl.style.padding='0 0 14px 0'
            el.appendChild(countEl)

            const contentEl = document.createElement('div')
            contentEl.classList.add('zzzContentEl')
            el.appendChild(contentEl)

            const lineEl = document.createElement('div')
            lineEl.classList.add('zzzLineEl')
            lineEl.style.position = 'absolute'
            lineEl.style.bottom = '5px'
            lineEl.style.left = '0'
            lineEl.style.transition = '20s'
            lineEl.style.height = '4px'
            lineEl.style.background = '#15afcb'
            lineEl.style.borderRadius = '2px'
            lineEl.style.width = '1px'
            el.appendChild(lineEl)
        }
        const countEL = el.querySelector('.zzzCountEl')
        countEL.innerHTML=`已查询<span style="color: #15afcb; font-weight: bold">${runCount}</span>次，已接揽<span style="color: #15afcb; font-weight: bold">${count}</span>单`
        const c = el.querySelector('.zzzContentEl')
        c.innerText = text
        setTimeout(() => {
            const line = el.querySelector('.zzzLineEl')
            if(text.indexOf('biu') > -1) {
                line.style.width = '1px'
                line.style.transition = '0s'
                setTimeout(() => {
                    line.style.width = '100%'
                    line.style.transition = '20s'
                })
            } else {
                line.style.transition = '0s'
                line.style.width = '0px'
            }
        })
    }
    function delay(t = 0) {
        if(!isRunning) {
            return closeZzzShowLog()
        }
        if(prePathName !== window.location.pathname) {
            isRunning = false
            return closeZzzShowLog()
        }
        return new Promise(resolve => {
            setTimeout(resolve, t * 1000)
        })
    }
    function logErr(info) {
        isRunning = false
        alert(`自动接单运行失败:【${info}】`)
    }
    // 第一步： 校验查询条件是否正确
    function checkStatus(){
        const item = document.querySelectorAll('.ant-form-item')
        for(let i of item){
            const label = i.querySelector('.ant-form-item-label')
            if(label){
                const text = label.querySelector('label')
                if(text.textContent === '订单状态'){
                    const status = i.querySelectorAll('.ant-select-selection__choice__content')
                    for(let a of status){
                        if(a.textContent !== '待揽收'){
                            logErr('订单状态请设置为 "待揽收"')
                            return false
                        }
                    }
                    return true
                }
            }
        }
        return false
    }
    // 第二步：查询查询按钮
    function queryEL(){
        const buttons = document.querySelectorAll('button.ant-btn-primary');
        const filteredButtons = [];
        buttons.forEach((button) => {
            // 检查当前按钮是否包含子元素
            if (button.querySelector('span')) {
                // 获取当前按钮内部的 span 元素
                const span = button.querySelector('span');

                // 检查 span 元素的文本内容是否为 "查询"
                if (span.textContent.trim() === '查询') {
                    // 如果满足条件，将按钮添加到结果数组中
                    filteredButtons.push(button);
                }
            }
        });
        if(filteredButtons.length !== 1){
            logErr('查询按钮未找到')
            return
        }
        const el = filteredButtons[0]
        return el;
    }
    // 第四步：获取接揽按钮
    function receiveBtn(){
        const buttons = document.querySelectorAll('button.ant-btn');
        const filteredButtons = [];
        buttons.forEach((button) => {
            // 检查当前按钮是否包含子元素
            if (button.querySelector('span')) {
                // 获取当前按钮内部的 span 元素
                const span = button.querySelector('span');

                // 检查 span 元素的文本内容是否为 "查询"
                if (span.textContent.trim() === '一键接揽') {
                    // 如果满足条件，将按钮添加到结果数组中
                    filteredButtons.push(button);
                }
            }
        });
        if(filteredButtons.length !== 1){
            logErr('接揽按钮未找到')
            return
        }
        const el = filteredButtons[0]
        return el;
    }
    // 查询表格数据
    function queryTableData(){
        var bodyEL = document.querySelector('.ant-table-tbody')
        if(!bodyEL) {
            logErr('表格数据未查询到')
            return
        }
        return bodyEL && bodyEL.childNodes.length
    }
    function closeModal(){
        const modalRoot = document.querySelectorAll('.ant-modal-root')
        if(modalRoot && modalRoot.length){
            for(let i of modalRoot){
                var tEl = i.querySelector('.ant-modal-confirm-title')
                if(tEl && tEl.textContent.trim() === '一键接揽成功'){
                    var btn = i.querySelector('.ant-btn')
                    btn.click()
                    zzzShowLog('执行关闭Modal操作')
                    setTimeout(reWork, 2000)
                }
            }
        }
    }
    var intervalTime = null
    function reWork(){
        if(!isRunning) return
        var time = 30
        zzzShowLog(`${time}秒后重新查询`)
        intervalTime = setInterval(() => {
            if(!isRunning) {
                closeZzzShowLog()
                return
            }
            zzzShowLog(`${--time}秒后重新查询`)
            if(time <= 1){
                clearInterval(intervalTime)
                work()
            }
        }, 1000)
    }
    async function delayFetchResult(el) {
        let t = 10
        let max = 0
        while (t > max) {
            if(!isRunning) return
            zzzShowLog(`10秒后查询结果【${t}】`)
            await delay(1)
            t --
        }
        if(el.className.indexOf('ant-btn-loading') > 0) {
            return await delayFetchResult(el)
        }
    }
    var work = async() => {
        try{
            let queryBtn = queryEL()
            if(!queryBtn) {
                return
            }

            queryBtn.click()
            runCount++
            zzzShowLog('biu biu biu~')
            await delayFetchResult(queryBtn)

            const dataLength = queryTableData()
            if(!dataLength) {
                zzzShowLog(`未查询到数据，2秒后重新开始查`)
                return setTimeout(reWork, 2000)
            }
            zzzShowLog(`查到了${dataLength}条订单`)
            const fixedEl = document.querySelector('.ant-table-fixed-left')
            if(!fixedEl) {
                return logErr('A全选按钮未找到')
            }
            const checked = fixedEl.querySelector('.ant-checkbox-input')
            if(!checked) {
                return logErr('B全选按钮未找到')
            }
            await delay(1)
            if(!isRunning) return
            checked.click()
            await delay(1)
            if(!isRunning) return
            const getReceiveBtn = receiveBtn()
            if(getReceiveBtn) {
                getReceiveBtn.click()
                zzzShowLog(`接揽按钮触发,5秒后关闭弹窗`)
                count += dataLength
                setTimeout(closeModal, 5000)
            }
        } catch(e){
            console.error('e', e)
            isRunning = false
            alert('接单脚本出错了，找州更新一下')
        }
    }
    if(checkStatus()){
        work()
    }
}
function stopWork() {
    isRunning = false
}