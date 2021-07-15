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

```
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