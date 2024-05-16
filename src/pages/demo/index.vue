<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '测试demo',
  },
}
</route>

<template>
  <view class="">
    <wd-button @click="toWotDemo">Wot Demo</wd-button>
  </view>
</template>

<script lang="ts" setup>
const toWotDemo = () => {
  uni.navigateTo({
    url: '/pages/demo/wot-demo',
  })
}
</script>

<style lang="scss" scoped>
//
</style>
