<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '测试页面',
  },
}
</route>

<template>
  <view class="">
    <button @tap="toEcharts1">图表1</button>
    <button @tap="toEcharts2">图表2</button>
    <button @tap="toZpagingDemo">z-paging容器滚动失效demo</button>
  </view>
</template>

<script lang="ts" setup>
const toEcharts1 = () => {
  uni.navigateTo({
    url: '/pages/echarts/echarts1',
  })
}
const toEcharts2 = () => {
  uni.navigateTo({
    url: '/pages/echarts/echarts2',
  })
}
const toZpagingDemo = () => {
  uni.navigateTo({
    url: '/pages/test/zpaging-demo',
  })
}
</script>

<style lang="scss" scoped>
//
</style>
