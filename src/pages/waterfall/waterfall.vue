<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '瀑布流',
  },
}
</route>

<template>
  <view class="">
    <WatWaterfall :isOnShow="isOnShow" ref="waterfallRef" />
  </view>
</template>

<script lang="ts" setup>
import WatWaterfall from './components/WatWaterfall.vue'
const waterfallRef = ref(null)
const isOnShow = ref(false)
onShow(() => {
  isOnShow.value = true
})
onHide(() => {
  isOnShow.value = false
})

onPullDownRefresh(() => {
  waterfallRef.value && waterfallRef.value.reloadData()
  uni.stopPullDownRefresh()
})
//
</script>

<style lang="scss" scoped>
//
</style>
