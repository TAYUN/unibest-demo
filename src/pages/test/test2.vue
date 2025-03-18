<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'canvas图片',
  },
}
</route>

<template>
  <view class="relative">
    <view id="canvasId">
      <view>canvas图片</view>
      <image :src="base64Image" crossOrigin="anonymous" @error="imageError" mode="widthFix"></image>
      <!-- 这里插入两张图片再生成海报 -->
    </view>
    <view class="fixed top-200px left-10px w-320px shadow-2xl z-9999 bg-#fff" v-show="show">
      <img class="w-full" mode="widthFix" id="canvasImgId" />
      <view class="flex justify-between">
        <text @tap="show = false">分享</text>
        <text @tap="show = false">保存</text>
      </view>
    </view>
    <wd-button @click="generatePoster">海报生成</wd-button>
  </view>
</template>

<script lang="ts" setup>
import html2canvas from 'html2canvas'
const img1 =
  'https://oss.wytparking.com/uploadfile/20240821/684781781111246848.jpg?x-oss-process=style/quantity'

// 跨平台图片转base64方法（兼容uni-app所有平台，H5使用Blob+FileReader）
// 跨平台图片转base64方法（兼容uni-app所有平台，H5使用ArrayBuffer->File->Base64）
function imageToBase64(url) {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' })
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })

        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      .catch(reject)
    // #endif

    // #ifndef H5
    uni.request({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      success: (res) => {
        const base64 = 'data:image/jpeg;base64,' + uni.arrayBufferToBase64(res.data)
        resolve(base64)
      },
      fail: reject,
    })
    // #endif
  })
}

const base64Image = ref('') // 用于存储Base64编码的图片

const convertImage = async () => {
  try {
    const base64 = await imageToBase64(img1)
    base64Image.value = base64
    console.log('转换成功:', base64)
  } catch (error) {
    console.error('转换失败:', error)
  }
}
convertImage()
// getImg()
// 图片转canvas
const ImageToCanvas = (img) => {
  // 创建一个 canvas 元素
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') // 获取2D上下文

  // 设置 canvas 的宽度和高度为图像的宽高
  canvas.width = img.width
  canvas.height = img.height
  // 将图像绘制到 canvas 上
  ctx.drawImage(img, 0, 0, img.width, img.height)

  return canvas // 返回 canvas 对象
}
/**
 * 解决图片跨域问题，将网络图片URL转为base64 URL。
 * @exports url2Base64
 * @param {string} src 网络图片URL
 * @returns {Promise} Promise对象返回base64 URL
 *
 */
const url2Base64 = async (src) =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = src
    img.onload = () => {
      const canvas = ImageToCanvas(img)
      const url = canvas.toDataURL('image/png')
      resolve(url)
    }
    img.onerror = () => {
      resolve(new Error('转换base64失败'))
    }
  })

/**
 * Dom转化为图片
 * @exports conver
 * @param {string} trigger  Dom的id
 * @param {string} imageElId  需要展示的图片的id
 * @param {object} options  html2canvas的选项
 * @example
 */
const generateCanvasImg = async (trigger, imageElId, options) => {
  try {
    const imgDom = document.getElementById(trigger)
    // let wxImg
    // let zfbImg
    // // 封装图片加载为 Promise
    // const loadImage = (url) => {
    //   return new Promise((resolve, reject) => {
    //     const img = new Image()
    //     img.crossOrigin = 'Anonymous'
    //     img.width = 100
    //     img.height = 100
    //     img.src = url
    //     img.onload = () => {
    //       resolve(img)
    //       console.log('img====>', img)
    //     } // 解析 Promise 并返回图片对象
    //     img.onerror = (error) => reject(error) // 失败时拒绝 Promise
    //   })
    // }
    // const loadImages = async () => {
    //   // 同时转换 URL 并加载图片
    //   const [wxImgUrl, zfbImgUrl] = await Promise.all([
    //     url2Base64(options.wxImgUrl),
    //     url2Base64(options.zfbImgUrl),
    //   ])
    //   // 并行加载两张图片

    //   ;[wxImg, zfbImg] = await Promise.all([loadImage(wxImgUrl), loadImage(zfbImgUrl)])
    //   // 全部加载完成后，再添加到页面
    //   imgDom.appendChild(wxImg)
    //   imgDom.appendChild(zfbImg)
    // }
    // 调用加载图片的函数
    // await loadImages()
    // 等待图片加载完成再往下执行

    // 在目标元素下插入图片
    if (imgDom) {
      // 设置html2canvas的选项
      const opts = {
        useCORS: true, // 支持跨域图片
        allowTaint: true,
        backgroundColor: 'transparent', // 背景透明
      }

      const canvas = document.createElement('canvas')
      const scale = 3 // 放大scale，避免图像模糊
      const width = imgDom.offsetWidth
      const height = imgDom.offsetHeight

      canvas.width = width * scale
      canvas.height = height * scale

      opts.scale = scale
      opts.canvas = canvas
      opts.width = width
      opts.height = height

      // 生成海报
      const canvasResult = await html2canvas(imgDom, opts)
      const base64ImgSrc = canvasResult.toDataURL('image/png')
      const img = document.getElementById(imageElId)
      if (img) {
        img.src = base64ImgSrc // 显示生成的海报
      }
      // imgDom.removeChild(wxImg)
      // imgDom.removeChild(zfbImg)
      if (options.callback && typeof options.callback === 'function') {
        options.callback(base64ImgSrc) // 回调返回生成的图片Base64路径
      }
    }
  } catch (error) {
    console.error('生成canvas图片异常:', error)
  }
}
const show = ref(false)
// 生成图片
const generatePoster = () => {
  try {
    const callback = () => {
      show.value = true
    }

    // generateCanvasImg('canvasId', 'canvasImgId', {
    //   callback,
    //   wxImgUrl:
    //     'https://oss.wytparking.com/uploadfile/20240821/684781781111246848.jpg?x-oss-process=style/quantity',
    //   zfbImgUrl: `https://oss.wytparking.com/uploadfile/20250304/755385395035402240.jpeg?x-oss-process=style/quantity`,
    // })
  } catch (error) {
    console.log('error', error)
  }
}
function drawCanvas() {
  // uni-app 中，不管是小程序，app，h5 在获取元素实例时，都是统一的方法,只要获取元素的宽高
  uni
    .createSelectorQuery()
    .select('#myCanvas')
    .fields({ node: true, size: true })
    .exec((res) => {
      // #ifdef APP-PLUS || H5
      // app 和 h5 的设置方式是一样的
      const tcx = uni.createCanvasContext('myCanvas') // 通过canvasId 创建画布
      // 设置图片，如果是背景图，就通过获取的实例，获取到他的宽高直接使用
      tcx.drawImage('../../../static/imgage/abc.png', 0, 0, res[0].width, res[0].height)
      // 文字和分割线设置和小程序无异
      tcx.draw() // 将设置的内容绘制出来，不写不显示
      // #endif
    })
}
</script>

<style lang="scss" scoped>
//
</style>
