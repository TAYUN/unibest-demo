<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '瀑布2',
  },
}
</route>

<template>
  <!-- 瀑布流组件 -->
  <pure-waterfall :cols="cols" :gap="gap">
    <pure-waterfall-item
      v-for="(item, index) in list"
      :key="item.id"
      :item="item"
      :index="index"
      :loaded="item.loaded"
    >
      <!-- # 此处自定义 Item 内容和样式 -->
      <view class="shadow-xl">
        <image
          class="item-image w-full"
          :src="item.img"
          mode="widthFix"
          @load="handleLoad(item, index)"
        />
        <view class="item-text">
          <text>第 {{ index + 1 }} 个元素</text>
        </view>
        <view class="item-delete" hover-class="pure-hover" @tap.stop="handleDelete(item, index)">
          <pure-icon name="__cuo"></pure-icon>
        </view>
      </view>
    </pure-waterfall-item>
  </pure-waterfall>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'

// 数据列表
const list = ref([])

// 列数
const cols = ref(2)

// 间距
const gap = ref('10px')

// 图片列表
const imgs = [
  'https://gips0.baidu.com/it/u=567323913,331130417&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f1000_1000',
  'http://gips3.baidu.com/it/u=775223787,1959096310&fm=3028&app=3028&f=JPEG&fmt=auto?w=1440&h=2560',
  'http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960',
  'http://gips3.baidu.com/it/u=100751361,1567855012&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  'https://gips3.baidu.com/it/u=3732737575,1337431568&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f1440_2560',
  'http://gips0.baidu.com/it/u=3560029307,576412274&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  'http://gips3.baidu.com/it/u=3892227616,2240763844&fm=3028&app=3028&f=JPEG&fmt=auto?w=3200&h=3200',
  'http://gips1.baidu.com/it/u=3885198370,1571719977&fm=3028&app=3028&f=JPEG&fmt=auto?w=2560&h=1920',
  'http://gips0.baidu.com/it/u=3557606594,2640240494&fm=3028&app=3028&f=JPEG&fmt=auto?w=2048&h=2048',
  'http://gips2.baidu.com/it/u=3589715542,620993072&fm=3028&app=3028&f=JPEG&fmt=auto?w=2048&h=2048',
  'http://gips0.baidu.com/it/u=398917425,2942293409&fm=3028&app=3028&f=JPEG&fmt=auto?w=1920&h=2560',
  'http://gips0.baidu.com/it/u=1370402140,2009956566&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  'http://gips2.baidu.com/it/u=3579059838,1031544773&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=720',
  'http://gips3.baidu.com/it/u=1121275038,3924754772&fm=3028&app=3028&f=JPEG&fmt=auto?w=1920&h=2560',
  'https://gips1.baidu.com/it/u=2622851591,902014643&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f600_800',
  'http://gips2.baidu.com/it/u=658660608,3402622316&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960',
  'http://gips3.baidu.com/it/u=1821127123,1149655687&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280',
  'http://gips3.baidu.com/it/u=3557221034,1819987898&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960',
  'http://gips1.baidu.com/it/u=1647344915,1746921568&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280',
  'http://gips3.baidu.com/it/u=3419425165,837936650&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024',
]

// 页面加载后
onReady(async () => {
  // 初始化数据列表
  initList()
})

// 初始化数据列表
function initList() {
  const items = []
  for (let i = 0; i < 10; i++) {
    items.push({
      id: Math.random().toString().slice(2, 6),
      loaded: false,
      img: imgs[i],
    })
  }
  list.value = items
}

// 资源加载完成事件
function handleLoad(item, index) {
  // 更新资源加载状态
  item.loaded = true
}
</script>

<style lang="scss" scoped>
//
</style>
