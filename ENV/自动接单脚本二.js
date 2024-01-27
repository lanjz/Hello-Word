
(function (){
    if(!window._zzzRun){
        window._zzzRun = 1
    } else {
        window._zzzRun ++
    }
    const runId = window._zzzRun
    let count = 0
    let runCount = 0
    const d = new Date()
    const curTime = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    async function zzzPostData(url, params) {
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(params), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
    async function zzzJieDan(list) {
        if(!list || !list.length) return
        // subCodeList
        function zzzAddSubCodeList(list) {
            return list.map((function(e) {
                e.__hasDispSiteChanged = false
                e.packManId = 61320
                e.packManName = "惠州陈江"
                if (e.amount && e.code) {
                    let t = 1;
                    const n = [];
                    for (; t < e.amount + 1; t++) {
                        const r = "00".concat(t).substr(-3)
                            , o = "".concat(e.code).concat(r);
                        n.push(o)
                    }
                    return {
                        ...e,
                        subCodeList: n,
                    }
                }
                return {
                    ...e,
                    subCodeList: []
                }
            }))
        }
        const url = 'https://v5.800best.com/ltlv5-war/web/outOrder/batchReceiveAndPickupOrder'
        const params = zzzAddSubCodeList(list)
        zzzPostData(url, params)
            .then((data) => {
                if(data.code === '200') {
                    zzzShowLog(`成功接揽${list.length}条订单`)
                    count += list.length
                } else {
                    zzzShowLog(`接揽失败`, true)
                }
            })
            .catch(() => {
                zzzShowLog('接揽发生了错误！', true)
            })
    }
    async function zzzGetOrder() {
        const url = "https://v5.800best.com/ltlv5-war/web/orderItem/searchOrderItem"
        const time = getDataRange()
        const params = {
            "originIdList":[],
            "processStatus":null,
            "processStatusList":[
                "UN_FINISH",
                "WAITING_PICKUP",
            ],
            "delayFlag":false,
            "bluetoothWeightStatus":null,
            "exceptionOrderFlag":false,
            "scannedNotUploaded":false,
            "pickUpFailFlag":false,
            "sendSiteIdList":null,
            "showSendSiteSelect":true,
            "sorts":[{"sortDir":"desc","sortKey":"created_time"}],
            "channelTypeList":[],
            "pageSize":300,
            "currentPage":1,
            "outOrder":true,
            "createDateStart":time[0] + " 00:00:00",
            "createDateEnd":time[1] + " 23:59:59",
            "sendCompanyId":60977
        }
        zzzShowLog('biu biu biu~')
        runCount++
        zzzPostData(url, params).then((data) => {
            console.log('data', data)
            if(data.code !== '200') {
                return zzzShowLog('查询失败！', true)
            }
            if(data.pageList && data.pageList.list) {
                zzzJieDan(data.pageList.list)
            } else {
                zzzShowLog('没有查到可以接揽的订单')
            }
        }).catch(() => {
            zzzShowLog('查询发生了错误！', true)
        }).finally(() => {
            if(runId === window._zzzRun) {
                if(count > 0) return
                setTimeout(zzzGetOrder, 20 * 1000)
            }
        });
    }
    function getDataRange(){
        var currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1); // 注意这里需要先将月份减1再进行操作
        currentDate.setDate(1);
        var lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
            var day = (date.getDate() < 10 ? "0" : "") + date.getDate();
            return year + "-" + month + "-" + day;
        }
        return [formatDate(currentDate), formatDate(new Date())]
    }
    zzzGetOrder()

    function zzzShowLog(text, err){
        let el = document.querySelector('.zzzKLog')
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
})()


var b =
    {
        "id": 156707065,
        "createdTime": "2024-01-07 13:28:50",
        "creatorName": "APP13528038813",
        "lockVersion": 0,
        "creatorId": -1,
        "townId": 21384,
        "townName": "莆美镇",
        "sendSiteId": 7727848,
        "sendSiteName": "惠州陈江ZX",
        "sendSiteCode": "5160292",
        "dispSiteId": 9588235,
        "dispSiteName": "漳州云霄六部ZX",
        "dispSiteCode": "3631027",
        "whetherChargeTownFee": false,
        "specialServiceName": "正常派送",
        "specialService": "NORMAL_DISPATCH",
        "acceptAddress": "福建省漳州市云霄县莆美镇中柱村中兴路6-1号(和阳建材)",
        "sendParentId": 8079872,
        "sendParentName": "谢岗分拨",
        "dispParentId": 1037961,
        "dispParentName": "厦门分拨",
        "code": "81282485351",
        "orderItemNo": "DD000156707065",
        "processStatus": "UN_FINISH",
        "sendDate": "2024-01-07 13:28:50",
        "transferCode": "TB240107002469",
        "customerId": 22729886,
        "customerName": "小卢",
        "customerCode": "V22729885",
        "sendPhone": "13528038813",
        "sendAddress": "广东省惠州市惠城区陈江街道利市围村利市围13号",
        "sendPerson": "小卢",
        "acceptPhone": "13799834146",
        "acceptPerson": "李先生",
        "productId": 90,
        "productName": "普件",
        "serviceModeId": 57,
        "serviceMode": "派送",
        "amount": 3,
        "cubic": 0.0,
        "grossWeight": 0.0,
        "otherFees": 0.0,
        "paymentFee": 0.0,
        "warehouseFee": 0.0,
        "insureAmount": 2000.0,
        "actualWeight": 50.0,
        "paymentTypeId": 30,
        "paymentType": "现付",
        "notifyDelivery": false,
        "retro": false,
        "isCurSend": false,
        "cargo": "美缝剂",
        "recordSiteId": 7727848,
        "recordSiteName": "惠州陈江ZX",
        "weight": 50.0,
        "recordFee": 0.0,
        "podFee": 0.0,
        "unfinishOrderItemNum": 0,
        "updateOriginal": "SERVICE_EMP",
        "originId": 2875,
        "originName": "微信小程序普通单",
        "orderType": "COD",
        "acceptCanton": "福建省|漳州市|云霄县",
        "codMoney": "1752.0",
        "insuranceTypeId": 648,
        "insuranceType": "普通货险",
        "acceptAddressDetail": "莆美镇中柱村中兴路6-1号(和阳建材)",
        "totalPrice": "133.0",
        "codServiceType": "当日返",
        "codServiceTypeId": 386,
        "cusGradeId": 1162,
        "cusGradeName": "普通客户",
        "preScanCount": 0,
        "preScanStatus": "未扫",
        "bluetoothWeightStatus": "NO_WEIGHT",
        "bluetoothWeightCount": 0,
        "bluetoothWeight": 0.0,
        "bluetoothCubic": 0.0,
        "flagBits": "0000000000",
        "delayFlag": false,
        "platformPrice": 133.0,
        "basicServiceId": 1,
        "dispSiteAllowModify": true,
        "abnormalDispSite": false,
        "channelType": "PART_ONE",
        "dispAddressAllowModify": false,
        "expectedGotStartTime": "2024-01-07 13:28:50",
        "expectedGotEndTime": "2024-01-07 15:28:50",
        "specialArea": false,
        "showAcceptInfo": false
    }


var a = [
    {
        "id":156707065,
        "createdTime":"2024-01-07 13:28:50",
        "creatorName":"APP13528038813",
        "lockVersion":0,
        "creatorId":-1,
        "townId":21384,
        "townName":"莆美镇",
        "sendSiteId":7727848,
        "sendSiteName":"惠州陈江ZX",
        "sendSiteCode":"5160292",
        "dispSiteId":9588235,
        "dispSiteName":"漳州云霄六部ZX",
        "dispSiteCode":"3631027",
        "whetherChargeTownFee":false,
        "specialServiceName":"正常派送",
        "specialService":"NORMAL_DISPATCH",
        "acceptAddress":"福建省漳州市云霄县莆美镇中柱村中兴路6-1号(和阳建材)",
        "sendParentId":8079872,
        "sendParentName":"谢岗分拨",
        "dispParentId":1037961,
        "dispParentName":"厦门分拨",
        "code":"81282485351",
        "orderItemNo":"DD000156707065",
        "processStatus":"UN_FINISH",
        "sendDate":"2024-01-07 13:28:50",
        "transferCode":"TB240107002469",
        "customerId":22729886,
        "customerName":"小卢",
        "customerCode":"V22729885",
        "sendPhone":"13528038813",
        "sendAddress":"广东省惠州市惠城区陈江街道利市围村利市围13号",
        "sendPerson":"小卢",
        "acceptPhone":"13799834146",
        "acceptPerson":"李先生",
        "productId":90,
        "productName":"普件",
        "serviceModeId":57,
        "serviceMode":"派送",
        "amount":3,
        "cubic":0,
        "grossWeight":0,
        "otherFees":0,
        "paymentFee":0,
        "warehouseFee":0,
        "insureAmount":2000,
        "actualWeight":50,
        "paymentTypeId":30,
        "paymentType":"现付",
        "notifyDelivery":false,
        "retro":false,
        "isCurSend":false,
        "cargo":"美缝剂",
        "recordSiteId":7727848,
        "recordSiteName":"惠州陈江ZX",
        "weight":50,
        "recordFee":0,
        "podFee":0,
        "unfinishOrderItemNum":0,
        "updateOriginal":"SERVICE_EMP",
        "originId":2875,
        "originName":"微信小程序普通单",
        "orderType":"COD",
        "acceptCanton":"福建省|漳州市|云霄县",
        "codMoney":"1752.0",
        "insuranceTypeId":648,
        "insuranceType":"普通货险",
        "acceptAddressDetail":"莆美镇中柱村中兴路6-1号(和阳建材)",
        "totalPrice":"133.0",
        "codServiceType":"当日返",
        "codServiceTypeId":386,
        "cusGradeId":1162,
        "cusGradeName":"普通客户",
        "preScanCount":0,
        "preScanStatus":"未扫",
        "bluetoothWeightStatus":"NO_WEIGHT",
        "bluetoothWeightCount":0,
        "bluetoothWeight":0,
        "bluetoothCubic":0,
        "flagBits":"0000000000",
        "delayFlag":false,
        "platformPrice":133,
        "basicServiceId":1,
        "dispSiteAllowModify":true,
        "abnormalDispSite":false,
        "channelType":"PART_ONE",
        "dispAddressAllowModify":false,
        "expectedGotStartTime":"2024-01-07 13:28:50",
        "expectedGotEndTime":"2024-01-07 15:28:50",
        "specialArea":false,
        "showAcceptInfo":false,
        "subCodeList":["81282485351001","81282485351002","81282485351003"],
        "__hasDispSiteChanged":false,
        "packManId":61320,
        "packManName":"惠州陈江"
    }]

