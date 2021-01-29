<!-- 大图 -->
<template>
  <div class="preview-files-popup" :style="style" v-if="visible">
    <div class="small-popup-inner" @click.stop>
      <div class="right-close-icon" @click="close">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </div>
      <el-carousel
        :autoplay="false"
        :initialIndex="initialIndex"
        arrow="always"
      >
        <el-carousel-item v-for="(item, index) in imgList" :key="index">
          <div v-if="item._type === 'pdf'" class="relative-full">
            <iframe
              height="100%"
              width="100%"
              class="iframe"
              :name="item.name"
              :src="item.url"
              frameborder="0"
            ></iframe>
          </div>
          <div v-else-if="item._type === 'video'" class="relative-full">
            <video width="320" height="240" controls>
              <source :src="item.url">
              您的浏览器不支持 HTML5 video 标签。
            </video>
          </div>
          <div v-else class="hll-img-item-box">
            <PreviewImage :url-list="[item.url]" ref="previewImage"/>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
import { blobTofile } from '@/utils/formatData'
import api from '@/api/order'
import { imgUrlConfig } from '@/utils/config';
const canViewFileList = []
  .concat(['.GIF', '.JPG', '.PNG', '.JPEG'])
  .concat(['.PDF'])
  .concat([ '.mp4', '.avi', '.rmvb'])
let isViewFileReg = new RegExp(`(${canViewFileList.join('|')})$`, 'i')
let prevOverflow = '';
export default {
  name: 'PreviewFile',
  componentAlias: 'PreviewFile',
  computed: {
    collapse () {
      console.log('this.$store', this.$store)
      return this.$store&&this.$store.state.collapse;
    },
    style(){
      let width = (this.collapse ? 64:240) + 20*2
      let height = 120 + 30
      return {
        width: `calc(100vw - ${width}px)`,
        height: `calc(100vh - ${height}px)`
      }
    }
  },
  data () {
    return {
      initialIndex: 0, // 默认开始
      visible: false,
      imgList: []
    };
  },
  methods: {
    getPdf(item, menuId){
      return api.getPDF({
        id: item.id,
        menuId: menuId ? menuId : undefined
      }).then(res => {
        if (+res.code === 0) {
          item.url = imgUrlConfig(res.data.url)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getImg(item, menuId){
      return api.getAttachment({
        id: item.id,
        menuId: menuId ? menuId : undefined
      }).then(res => {
        item.url = 'data:image/png;base64,' + btoa(
          new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      })
    },
    open(payload, menuId) {
      let { list = [], initialFile, useFetch = true } = payload
      if(!list.length) return
      if(!initialFile) initialFile = list[0]
      if (!isViewFileReg.test(initialFile.name)) {
        // 直接载下文件
        api.getFile({
          id: initialFile.id
        }).then(res =>{
          blobTofile(res, initialFile)
        })
        // window.open(file.url);
        return
      }
      let viewList = list.filter(item => isViewFileReg.test(item.name))
      if(initialFile) {
        this.initialIndex =  viewList.findIndex(item => item.name === initialFile.name) || 0;
      }
      const fetchArr = []
      viewList.map(item => {
        item._url = item.url // 记录原始字段值
        if (/.(pdf|PDF)$/.test(item.name)) {
          item._type = 'pdf'
          useFetch&&fetchArr.push(this.getPdf(item, menuId))
        } else {
          item._type = 'img'
          useFetch&&fetchArr.push(this.getImg(item, menuId))
        }
      })
      Promise.all(fetchArr).finally(() => {
        this.imgList = viewList
        this.visible = true
      })
    },
    close() {
      this.closeViewer()
      this.visible = false
      this.$emit('close');
    },
    closeViewer() {
      document.body.style.overflow = prevOverflow;
      this.$refs['previewImage']&&this.$refs['previewImage'].forEach(item => {
        item.deviceSupportUninstall()
      })
    }
  },
  mounted() {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'
  }
};
</script>
<style lang="scss" scoped>
.hll-img-item-box {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  .el-image__error {
    font-size: 0;
  }
  .el-image-viewer__close{
    display: none;
  }
}
.relative-full{
  position: relative;
  height: 100%;
  width: 100%;
}
.center-align{
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-files-popup {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  transition: all 0.1s ease-in-out;
  .el-carousel__item:nth-child(2n) {
    background-color: transparent;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: transparent;
  }
  ::v-deep.small-popup-inner {
    height: 100%;
    width: 100%;
    border-radius: 2px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-carousel__container {
      height: calc(100vh - 160px);
    }
    .right-close-icon {
      position: absolute;
      top: 0;
      right: 0;
      width: 30px;
      height: 30px;
      line-height: 30px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px #ccc;
      z-index: 9999;
      text-align: center;
      cursor: pointer;
      &:hover {
        i {
          color: red;
        }
      }
    }
  }
}
</style>
