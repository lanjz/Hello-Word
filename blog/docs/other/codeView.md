# CodeView

### 代码

```js
const PORTS = ['9780', '9700', '9750', '9740', '9741']
const PORTS_MAP_PREFIX = {
	9780: 'pos-user',
	9700: 'pos-main',
	9750: 'pos-price',
	9740: 'pos-order',
	9741: 'pos-site',
}
const serviceMapPorts = {
	feedback: PORTS[1],
	car: PORTS[1],
	friend: PORTS[1],
	dict: PORTS[1],
	fleetMember: PORTS[1],
	fleet: PORTS[1],
	fleetShare: PORTS[1],
	target: PORTS[1],
	address: PORTS[1],
	driverScore: PORTS[1],
	file: PORTS[1],
	city: PORTS[1],
	configCarType: PORTS[1],
	popup: PORTS[1],
	orderTrack: PORTS[4],
	fees: PORTS[2],
	order: PORTS[3],
	orderShare: PORTS[3],
	orderMidway: PORTS[3],
	pay: PORTS[3],
	driverScoreLog: PORTS[1],
}
export const baseUrl = {
	local: 'http://10.129.35.47',
	dev: 'https://pos-dev.huogigi.com/gateway',
	test: 'https://pos-stg.huogigi.com/gateway',
	pro: 'https://pos.huogigi.com/gateway',
}

export const ocrUrl = {
	local: 'http://172.30.192.61:8500/autotools/identify/api',
	dev: 'https://ocr-dev.huolala.cn/autotools/identify/api',
	test: 'https://ocr-stg.huolala.cn/autotools/identify/api',
	pro: 'https://ocr.huolala.cn/autotools/identify/api',
}


function getApiUrl(url){
	if(url.indexOf('/idCard') === 0 || url.indexOf('/vehiclePlate') === 0 || url.indexOf('/vehicleLicense') === 0){
		return ocrUrl[ENV]
		// return ocrUrl['local']
	}
	let base = url.substring(1)
	base = base.substring(0, base.indexOf('/'))
	const port = serviceMapPorts[base] || PORTS[0]
	if(ENV !== 'local'){
		// #ifdef MP-WEIXIN
		return `${baseUrl[ENV]}/${PORTS_MAP_PREFIX[port]}`
		// #endif
		// #ifdef H5
		return `/gateway/${PORTS_MAP_PREFIX[port]}`
		// #endif
	} else {
		return baseUrl[ENV] + ':'+ port
	}
}
```

**问题**

- 接口地址与最终域名的映射过程不够清晰

### 代码

```html
<div v-show="item.showDetailMsg" v-for="(val,idx) in subMsgTotalData[item.id]" :key="idx">
    <div style="display:inline-block; color: #606266;padding:3px; 5px;" @click.prevent="handleNone">
            <span>{{`${val.status2Str}`}}</span>
            <span>{{`${val.status3Str}`}}</span>
            <span>{{`${val.realName}`}}</span>
            <span>{{`${val.comName}`}}</span>
    </div>
    <span style="display:inline-block;color:#007dff;" @click.prevent="jumpToDetail(val)">去查看</span>
</div>
```

### 代码

```js
import axios from 'axios'
let token = sessionStorage.getItem('token')
const roleId = sessionStorage.getItem('roleId')
// export
export const downFile = (url, params, type, downloadName) => {
  axios({
    method: 'post',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/json',
      'filename': 'utf-8'
    },
    responseType: 'arraybuffer'
  }).then(response => {
    console.log(response, 'response')
    var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
    if (type === 'zip') {
      blob = new Blob([response.data], { type: 'application/x-zip-compressed;charset=utf-8' })
    }
    if (type === 'pdf') {
      blob = new Blob([response.data], { type: 'application/pdf' })
    }
    var downloadElement = document.createElement('a');
    var href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    if (type === 'pdf') {
      downloadElement.download = '金融进件'
    } else if(type === 'fileManage') {
      downloadElement.download = '档案信息列表导出'
    } else if( type === 'transferList'){
      downloadElement.download = decodeURIComponent(response.headers['filename']); //下载后文件名
    } else{
      downloadElement.download = response.headers['filename'] || downloadName; //下载后文件名
    }
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
  })
}

export const getLoadExcel = (url, params, type) => {
  axios({
    method: 'get',
    url,
    headers: {
      'Content-Type': 'application/json',
      //
      'filename': 'utf-8',
      token,
      roleId
    },
    params,
    responseType: 'arraybuffer'
  }).then(response => {
    var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
    if (type === 'zip') {
      blob = new Blob([response.data], { type: 'application/x-zip-compressed;charset=utf-8' })
    }
    var downloadElement = document.createElement('a');
    var href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = '订单业务流耗时明细'; // response.headers['filename']; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
  })
}
```

**问题**

- 封装

```
┌─/utils
│------ downFile.js
│------ downFile-pdf.js
│------ downFileByGet.js
│------ downFileSpary.js
│------ downFileTraffic.js

```

### 代码

```js
    filterDataCount(){
      let data = [
        { name: 'Today', volume: '', rentcarvolume: '', llpvolume: '', llp3volume: '', todayCount: '', GMVCount: ''},
        { name: 'MTD', volume: '', rentcarvolume: '', llpvolume: '', llp3volume: '', todayCount: '', GMVCount: ''},
        { name: 'Last M', volume: '', rentcarvolume: '', llpvolume: '', llp3volume: '', todayCount: '', GMVCount: ''},
        { name: 'MOM', volume: '', rentcarvolume: '', llpvolume: '', llp3volume: '', todayCount: '', GMVCount: ''},
      ]
      for(let item of this.tableData){
        const {comname, vdoing} = item
        if(comname === '合计'){
          if(vdoing === 'Today'){
            data[0].volume = +(item.volume||0) // 卖车
            data[0].rentcarvolume = +(item.rentcarvolume||0) // 租车
            data[0].llpvolume = +(item.llpvolume||0) // LLP
            data[0].llp3volume = +(item.llp3volume||0) // LLP3
            data[0].todayCount = data[0].volume + data[0].rentcarvolume + data[0].llpvolume + data[0].llp3volume // Total
            data[0].GMVCount = +(item.volumesum||0) + +(item.rentcarvolumesum||0) + +(item.llpvolumesum||0) + +(item.llp3volumesum||0) // GMV
            data[0].GMVCount = this.formatterCell(data[0].GMVCount, 'wan' )
          } else if(vdoing === 'MTD'){
            data[1].volume = +(item.volume||0) // 卖车
            data[1].rentcarvolume = +(item.rentcarvolume||0) // 租车
            data[1].llpvolume = +(item.llpvolume||0) // LLP
            data[1].llp3volume = +(item.llp3volume||0) // LLP3
            data[1].todayCount = data[1].volume + data[1].rentcarvolume + data[1].llpvolume + data[1].llp3volume // Total
            data[1].GMVCountTem = +(item.volumesum||0) + +(item.rentcarvolumesum||0) + +(item.llpvolumesum||0) + +(item.llp3volumesum||0) // GMV
            data[1].GMVCount = this.formatterCell(data[1].GMVCountTem, 'wan' )
          } else if(vdoing === 'Last M'){
            data[2].volume = +(item.volume||0) // 卖车
            data[2].rentcarvolume = +(item.rentcarvolume||0) // 租车
            data[2].llpvolume = +(item.llpvolume||0) // LLP
            data[2].llp3volume = +(item.llp3volume||0) // LLP3
            data[2].todayCount = data[2].volume + data[2].rentcarvolume + data[2].llpvolume + data[2].llp3volume // Total
            data[2].GMVCountTem = +(item.volumesum||0) + +(item.rentcarvolumesum||0) + +(item.llpvolumesum||0) + +(item.llp3volumesum||0) // GMV
            data[2].GMVCount = this.formatterCell(data[2].GMVCountTem, 'wan' )
          } else if(vdoing === 'MOM'){
            data[3].volume = item.volume// 卖车
            data[3].rentcarvolume = item.rentcarvolume // 租车
            data[3].llpvolume = item.llpvolume // // LLP
            data[3].llp3volume = item.llp3volume // LLP3
            data[3].todayCount = ((data[1].todayCount-data[2].todayCount)/data[2].todayCount*100|0)+'%' // Total
            data[3].GMVCount = ((data[1].GMVCountTem-data[2].GMVCountTem)/data[2].GMVCountTem).toFixed(2)*100 + '%'
          }
        }
      }
      this.dataCount = data
    }
```

**问题**

- 利用逻辑的缺少注释

### 问题

```vue
<template>
  <div class="page-warp relative" :class="{'page-warp-bg': !!reportSrc}">
    <canvas canvas-id="shareCanvas" class="shareCanvas" :style="{width: cWid, height: cHei}" v-if="!reportSrc"></canvas>
    <image :src="tempReport" mode="widthFix" class="report-img" v-else></image>
    <view class="btn-layout" v-if="reportSrc">
      <button class="share-button" @click="btnShare"></button>
      <view class="tips">邀请您的好友一起加入啦啦快送大家庭吧！</view>
    </view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      QRUrl: '',
      show: false,
      cWid: 0,
      cHei: 0,
      bg: '',
      showAuthModal: false
    }
  }
  methods: {
    async drawShareImage () {
      uni.showLoading()
      let params = {
        f: 'q',
        c: APPTYPE(),
      }
      if(APPTYPE() === 'U'){
        params._f = 3
      }
      let scene = this.combineParamsFromMinxin(params, false)
      const fetchQR = this[ACTIONS.OWN_QR_POST]({ // 获取小程序二维码
        page: `subtree/pages/common/shareInDriver/index`,
        scene
      })
      const fetchShareConfig = this[ACTIONS.SHARE_CONFIG_GET]() // 获取分享背景图片
      const [res, res2] = await Promise.all([fetchQR, fetchShareConfig])
      this.bg = this.shareConfig.driverPic
      if(res.err && !res.err.code){ // 二维码获取失败
        let base = uni.arrayBufferToBase64(res.data) // buffer转base64
        const { data:temPath } = await saveBase64ToTemPath(base, 'shareFriendQR.png') // 生在临时路径
        this.QRUrl = temPath
      }
    },
  },
}
</script>
```

**问题**

- 多余的 `data` 属性 

### 代码 

```html
  <view class="page-padding" v-if="info" :class="{'page-middle': openShare}">
    <canvas canvas-id="canvas" style="height: 880rpx;width: 100%"></canvas>
<!--   <view class="qr-page">
     <view class="customer-des flex align-center">
       <view class="customer-avatar">
         <image class="avatar-img" mode="scaleToFill" :src="info.portrait"/>
       </view>
       <view class="customer-info">
         <view class="name flex align-center">
           {{info.name}}
         </view>
         <view class="txt">
           <text>{{info.manifesto}}</text>
         </view>
       </view>
     </view>
     <view class="qr-box">
       <template>
         <view class="qr-img-box">
           <image class="qr-img" mode="scaleToFill" :src="QRUrl" v-if="QRUrl"/>
         </view>
         <view class="txt" v-if="QRUrl">
           扫一扫上面的二维码图案，加入我的车队
         </view>
       </template>
     </view>
   </view>-->
    <view class="action-layout" v-if="!pageFrom">
      <button class="action-1 btnpx relative" @tap="saveImageToPhotosAlbum">
        保存到手机
        <globalBurying name="saveTeamQR" />
      </button>
      <button class="action-2 motorcade_card_click" open-type="share">分享给微信好友</button>
    </view>
    <view class="page-full-btn-layout" v-else>
        <authBtn phone info>
          <view class="page-full-btn" @tap="joinTeam">加入车队</view>
        </authBtn>
    </view>
    <u-modal
        v-model="showAuthModal"
        content="您未授权保存到相册权限，无法保存车队二维码"
        title=" "
        show-cancel-button
        confirm-color="#FF681D"
        confirm-text="前往授权"
        :content-style="{padding: '80rpx 40rpx 90rpx 40rpx', fontSize: '36rpx', color: '#171B25'}"
        @confirm="confirmModal"
    ></u-modal>
  </view>
```

**问题**

- 无用代码

### 代码

```js
{
  data() {
    return {
      pageButtons: [],
      tableData: [],
      searchForm: {
        businessType: undefined,
        mobile: undefined,
        name: undefined,
        orderSn: undefined,
        status: undefined,
        sn: undefined,
        date: []
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      curComId: this.$store.state.loginData.optComId, // 当前用户所在城市
    }
  },
  computed: {
    companyOptions(){
      return this.$store.state.companyData
    },
  },
}
```

```js
{
    computed:{
      ...mapState('team', ['teamsInfo']),
      ...mapState('userinfo', ['userinfo']),
      // 小程序事件上报使用
      curUserId(){
        return this.userinfo.userId || ''
      },
    },
		methods: {
      ...mapActions('own', [
        ACTIONS.OWN_QR_POST
      ]),
      ...mapActions('team', [
        ACTIONS.TEAM_INFO_GET,
        ACTIONS.TEAM_MEMBER_POST,
        ACTIONS.TEAM_INFO_SHARE_GET
      ]),


```

### 代码 

```js
    saveOperation(callback) {
      // 非东莞、上海、佛山城市，车牌字段置空
      if(this.showData.comId != 10003 && this.showData.comId != 10004 && this.showData.comId != 10007){
        this.showData.licenseLocation = null
      }
      // 临时处理 提车小计为负 验证提示
      if(this.showData.sumAmount < 0) return this.$message.error('提车小计不能为负！')
      if (this.operationId) {
        this.$refs.showData.validate(valid => {
          if (valid) {
            if(this.showData.type == 2) this.showData.lastPayment = 0
            orderApi.order('edit', this.showData).then(res => {
              if (+res.code === 0) {
                if (callback) {
                  callback()
                } else {
                  this.$refs.editSmallHllPopupBoxs.close()
                  this.$message.success('订单编辑成功！')
                  this.editVisible = false
                }
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      } else {
        this.$refs.showData.validate(valid => {
          if (valid) {
            this.saveOrder(this.showData)
          } else {
            this.$message.error('请完善')
          }
        })
      }
    },
    // 查询订单
    queryOrder() {
      orderApi.order('info', {
        id: this.operationId
      }).then(res => {
        if (+res.code === 0) {
          let datas = res.data
          this.showData = Object.assign({}, datas)
          this.showData.memberType = 3 // 锁死 超级会员
          this.$refs.baseMessageBox.getTableData('edit', datas.comId)
          this.$refs.financingMessageBox.selectBrandTrigger(datas.vehicleBrandId, false, () => {
            this.$refs.financingMessageBox.selectModelTrigger(datas.vehicleModelId)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 保存订单
    saveOrder() {
      this.loading = true;
      orderApi.order('add', this.showData).then(res => {
        if (+res.code === 0) {
          this.$refs.editSmallHllPopupBoxs.close()
          this.$message.success('订单添加成功！')
          this.$emit('update')
          this.loading = false
        } else {
          this.$message.error(res.msg)
        }
      })
    }
```

**问题**

- 请求结果封装处理

### 代码

```js
// 新增 | 编辑 | 调配
handleAction (type, id, row) {
  console.log(row, 'row')
  this.operationId = id;

  switch (type) {
  case 'receipt':
    orderApi.orderDetail({
      id: row.orderId
    }).then(res => {
      if (+res.code === 0) {
        this.paymentVisible = true
        this.$nextTick(() => {
          this.$refs.paymentBox.open({
            id: row.orderId,
            type: res.data.type,
            comId: res.data.comId,
            businessType: res.data.businessType,
            orderSn: res.data.sn,
          })
        })
      } else {
        this.$message.error(res.msg)
      }
    })
    break
  case 'collection':
    this.collectionVisible = true
    this.$nextTick(() => {
      this.$refs.collectionBox.open(row)
    })
    break
  case 'telephone':
    apiOrder.orderDetail({
      formId: 1000,
      id: row.orderId
    }).then(res => {
      let mobile = res.code == 0 && res.data.mobile || ''
      if ($('#reasonid').val() === '108') {
        // $('#show-tel').val(mobile)
        $('#tel').val(mobile)
      }
    })
    console.log('telephone')
    break
  case 'distribute':
    this.openChange()
    break
  }
},
```

### 代码

```js
filterArray(row) {
      const { status, inStockStatus, orderBusinessType, offlinePay} = row;
      let newArr = [];
      let list = this.pageButtons.filter(item => item.fieldName !== 'delFile');
      const viewBtn = list.filter(item => item.fieldName === 'view');
      newArr.push(...viewBtn)
      
      // status 5/待退款  打款和打款失败出现
      // status 7/打款确认 出现打款确认按钮
      // status -4 -1 0 2/车务审批  出现修改按钮
      // status 0 状态未提交可以驳回
      if (Number(status) === 0) {
        const delBtn = list.filter(item => item.fieldName === 'revocation');
        newArr.push(...delBtn)
      }

      /**
         * 租车 临时
         */
      if(Number(orderBusinessType) === 1){
        const editRange = [0, -1, 1, 2, 3, 4, 8, 9, 11, 12, 13, 14, 16];
        if (editRange.includes(status)) {
          const editBtn = list.filter(item => item.fieldName === 'approve');
          newArr.push(...editBtn)
        }
      } else {
        //0未提交 -1驳回 2车务审核 3项目负责人审核 8财务审核 14续保专员 11车务收车 13催收专员 -4打款失败 17整备审核 18总部财务审核 19 车务上传整备照片
        const editRange = [0, -1, 2, 3, 8, 11, 12, 13, 14, 17, 18, 19];
        if (editRange.includes(status)) {
          const editBtn = list.filter(item => item.fieldName === 'approve');
          newArr.push(...editBtn)
        }
      }

      // let flag = false
      // if(Number(status) === 2 && this.$store.state.loginData.positionId === 1000){ //车务审核&&当前登录为车务
      //   flag = true
      // } else if(Number(status) === 16 && this.$store.state.loginData.positionId === 1002){ //销售审核&&当前登录为销售
      //   flag = true
      // } else if(Number(status) === 3 && this.$store.state.loginData.positionId === 1063){ // 租车负责人审核&&当前登录为租车负责人
      //   flag = true
      // } else if(Number(status) === 8 && this.$store.state.loginData.positionId == 1003) { //财务审核&&当前登录为财务
      //   flag = true
      // }
      // if(flag){
      //   const editBtn = list.filter(item => item.fieldName === 'approve');
      //   newArr.push(...editBtn)
      // }

      // （4 车务复核违章）确认违章费  租车
      if(Number(status) === 4 && orderBusinessType === 1) {
        const Btn = list.filter(item => item.fieldName === 'comfirm');
        newArr.push(...Btn)
      }

      // 审批通过  是否打款
      if (Number(status) === 7 && orderBusinessType === 1) {
        const comfirmBtn = list.filter(item => item.fieldName === 'payComfirm');
        newArr.push(...comfirmBtn)
      }

      // 待退款||打款失败  打款/打款失败
      if (Number(status) === 5 || Number(status) === -4 && orderBusinessType === 1) {
        const payBtn = this.pageButtons.filter(item => item.fieldName === 'remit');
        const payFailBtn = this.pageButtons.filter(item => item.fieldName === 'paymentFail');
        newArr.push(...payBtn);
        newArr.push(...payFailBtn);
      }

      // 车务审核时入库  或者 未入库 一直展示
      if (Number(status) >= 3 && inStockStatus === 0 && orderBusinessType === 1 ) {
        const checkedIn = list.filter(item => item.fieldName === 'vehicleIn');
        newArr.push(...checkedIn)
      }

      // 购车： 提交之后 且 未入库 一直展示
      if ( Number(status) > 0 && inStockStatus === 0 && orderBusinessType === 0 ) {
        const checkedIn = list.filter(item => item.fieldName === 'vehicleIn');
        newArr.push(...checkedIn)
      }
      newArr.push(...list.filter(item => item.fieldName === 'modifyModuleData'));
      if(orderBusinessType === 0){ 
        newArr.push(...list.filter(item => item.fieldName === 'calcProfit'))
      }

      if(status == 15 || status == 5){
        if(offlinePay == 0){
          newArr.push(...list.filter(item => item.fieldName === 'applyPayback'))
        }
      }

      // if(status == -4){
      //   const payBtn = this.pageButtons.filter(item => item.fieldName === 'remit');
      //   const payFailBtn = this.pageButtons.filter(item => item.fieldName === 'paymentFail');
      //   newArr.push(...payBtn);
      //   newArr.push(...payFailBtn);
      // }

      return newArr;
    },
```

**问题**

- `if/else`

### 代码 

```html
    <ul v-if="approveList.length > 0">
      <li 
        v-for="(item,index) in approveList" 
        :key="index" 
        :class="item.status"
        :id="`${action}-${item.id}`">
        <div class="step">{{item.sequence}}</div>
        <h2>{{item.name}}</h2>
        <div class="step-info">
          <p>审核职位：{{item.handleName}}</p>
          <p>审批时间：{{item.auditTime}}</p>
          <p>审批人：{{item.staffName}}</p>
          <!---.....-->
        </div>
      </li>
    </ul>
```

**问题**

- `key`

### 代码

```vue
<template>
  <div class="area-wrap"></div>
</template>

<script>
export default {
  data(){
    return {
      activeName: 'south',
      areaList: [
        {
          'id': '1',
          'name': '华南区',
          'alias': 'south',
          'children': [
            {
              'id': '101',
              'name': '广东',
              'children': [
                { 'id': '10101', 'name': '深圳福田总部' },
                { 'id': '10102', 'name': '广州分部' },
                { 'id': '10103', 'name': '珠海某分部' },
                { 'id': '10104', 'name': '汕头分部' },
                { 'id': '10105', 'name': '佛山某分部' },
                { 'id': '10106', 'name': '韶关分某部' },
                { 'id': '10107', 'name': '湛江分部' },
                { 'id': '10108', 'name': '肇庆分部' },
                { 'id': '10109', 'name': '江门某分部' },
                { 'id': '10110', 'name': '茂名分部' },
                { 'id': '10111', 'name': '惠州分部' },
                { 'id': '10112', 'name': '梅州分部' },
                { 'id': '10113', 'name': '汕尾分某部' },
                { 'id': '10114', 'name': '河源分部' },
                { 'id': '10115', 'name': '阳江分部' }
              ]
            },
            {
              'id': '102',
              'name': '广西',
              'children': [
                { 'id': '10201', 'name': '南宁分部' },
                { 'id': '10202', 'name': '柳州某分部' },
                { 'id': '10203', 'name': '桂林分部' },
                { 'id': '10204', 'name': '百色分部' },
                { 'id': '10205', 'name': '北海某分部' }
              ]
            },
            {
              'id': '103',
              'name': '海南',
              'children': [
                { 'id': '10301', 'name': '海南某分部' },
                { 'id': '10302', 'name': '三亚某分部' }
              ]
            },
          ]
        },
        {
          'id': '2',
          'name': '华中区',
          'alias': 'center',
          'children': [
            {
              'id': '201',
              'name': '湖北',
              'children': []
            },
            {
              'id': '202',
              'name': '湖南',
              'children': [
                { 'id': '20201', 'name': '长沙城市' },
                { 'id': '20202', 'name': '岳阳城市' },
                { 'id': '20203', 'name': '衡阳城市' },
                { 'id': '20204', 'name': '郴州城市' },
                { 'id': '20205', 'name': '永州城市' }
              ]
            }
          ]
        },
        {
          'id': '3',
          'name': '华东区',
          'alias': 'east',
          'children': []
        },
        {
          'id': '4',
          'name': '华北区',
          'alias': 'north',
          'children': []
        },
        {
          'id': '5',
          'name': '西南区',
          'alias': 'westSouth',
          'children': []
        },
        {
          'id': '6',
          'name': '西北区',
          'alias': 'westNorth',
          'children': []
        },
        {
          'id': '7',
          'name': '港澳台',
          'alias': 'oversea',
          'children': []
        },
      ],
      areaItems: [],
      tabIdx: 0, // tab切换记录
      idx: 0, // 操作记录
      currentActive: '', // 当前选中
    }
  },
  computed: {
    filterAreaList(){
      let arr = []
      this.areaList.map(item => {
        if(item.children && item.children.length){
          item.children.map((it, idx) => {
            if(it.children.length < 1) item.children.splice(idx, 1)
          })
          arr[arr.length] = item
        }
      })
      return arr
    }
  },
}
</script>

```

**问题**

- 无用 `data`

### 代码

```js
    dialogVisible: {
      handler(newVal){
        if(newVal){

          this.$nextTick(() => {

            if(this.steps){
              this.active = `#${this.steps[0].name}`
              this.steps.map(item => {
                this[`distance_${item.name}`] = 
                  document.querySelector(`#${item.name}`) && document.querySelector(`#${item.name}`).offsetTop
              })
            }

            document.querySelector(`#dialog-middle-${this.flag}-${this.action}`) &&
            document.querySelector(`#dialog-middle-${this.flag}-${this.action}`).addEventListener('scroll', this.scroll)

            document.querySelector(`#dialog-middle-x-${this.flag}-${this.action}`) &&
            document.querySelector(`#dialog-middle-x-${this.flag}-${this.action}`).addEventListener('scroll', this.scrollX, true)
          })
        }else{
          setTimeout(() => {
            this.steps && this.clickStep(`#${this.steps[0].name}`)
          }, 500)

          window.removeEventListener('scroll', this.scroll) // 关闭弹窗清除（移除）滚轮滚动事件
          window.removeEventListener('scroll', this.scrollX) // 关闭弹窗清除（移除）滚轮滚动事件
        }
      },
      deep: true
    }
```

### 代码

```vue
<div class="header-info">
          <p>
            <span class="info-l">订单编号：</span>
            <span>{{ruleForm.orderSn || '-'}}</span>
          </p>
          <!--           <p>
            <span class="info-l">合同编号：</span>
            <span>{{ruleForm.orderContractNo || '-'}}</span>
          </p>-->
          <p>
            <span class="info-l">城市：</span>
            <span>{{ruleForm.orderComName || '-'}}</span>
          </p>
          <p>
            <span class="info-l">订单状态：</span>
            <span>{{ruleForm.orderStatusName || '-'}}</span>
          </p>
          <p>
            <span class="info-l">申请时间：</span>
            <span>{{ruleForm.orderApplyDate || '-'}}</span>
          </p>
          <p>
            <span class="info-l">交车时间：</span>
            <span>{{ruleForm.orderHandoverDate || '-'}}</span>
          </p>
          <p>
            <span class="info-l">业务类型：</span>
            <span>{{ruleForm.orderBusinessType === 0 ? '卖车' : '租车'}}</span>
          </p>
          <p>
            <span class="info-l">销售人员：</span>
            <span>{{ruleForm.orderSalesManagesName || '-'}}</span>
          </p>
          <p>
            <span class="info-l">购车人：</span>
            <span>{{`${ruleForm.orderName}-${ruleForm.orderMobile}`}}</span>
          </p>
          <p>
            <span class="info-l">赠送会员合计：</span>
            <span>{{`${ruleForm.orderGiveMember}个月` || '-'}}</span>
          </p>
          <p>
            <span class="info-l">赠送备注：</span>
            <span>{{ruleForm.orderGiveMemberRemarks || '-'}}</span>
          </p>
          <!-- <div v-if="checkDst"> -->
            <p v-if="checkDst">
              <span class="info-l">月供：</span>
              <span>{{ruleForm.orderMonthlyPayment || '-'}}</span>
            </p>
            <p v-if="checkDst">
              <span class="info-l">租期：</span>
              <span>{{ruleForm.orderTenancy || '-'}}</span>
            </p>
            <p v-if="checkDst">
              <span class="info-l">保证金：</span>
              <span>{{ruleForm.orderDeposit}}</span>
            </p>
            <p v-if="checkDst">
              <span class="info-l">起租日：</span>
              <span>{{ruleForm.orderStartDate || '-'}}</span>
            </p>
            <p v-if="checkDst">
              <span class="info-l">到期日：</span>
              <span>{{ruleForm.orderEndDate || '-'}}</span>
            </p>
            <p v-if="checkDst">
              <span class="info-l">还款日：</span>
              <span>{{ruleForm.orderPaymentDay || '-'}}</span>
            </p>
            <p v-if="checkDst">
              <span class="info-l">已缴期数：</span>
              <span>{{ruleForm.orderPaymentTenancy}}</span>
            </p>
            <p v-if="checkDst">
              <span class="info-l">剩余租金：</span>
              <span>{{ruleForm.orderSurplusRent}}</span>
            </p>
          <!-- </div> -->
        </div>
```