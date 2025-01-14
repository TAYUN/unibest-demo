<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'wot-issue',
  },
}
</route>

<template>
  <view class="">
    <button @click="toDatePicker">wd-datetime-picker问题</button>
  </view>
</template>

<script lang="ts" setup>
const toDatePicker = () => {
  uni.navigateTo({
    url: '/pages/wot/issue/wdDatetimePicker',
  })
}
</script>

<style lang="scss" scoped>
//
</style>
