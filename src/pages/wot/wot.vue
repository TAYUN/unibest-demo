<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'wot-issue',
  },
}
</route>

<template>
  <view class="">
    <button @click="navTo('/pages/wot/issue/wdDatetimePicker')">wd-datetime-picker问题</button>
    <button @click="navTo('/pages/wot/issue/borderNoShow')">第一个cell border线不显示</button>
    <button @click="navTo('/pages/wot/issue/wdTabsIssue')">wd-tabs吸顶问题</button>
    <button @click="navTo('/pages/wot/issue/pickerViewIssue')">pickerView无法滚动</button>
    <button @click="navTo('/pages/wot/issue/formIssue')">表单v-if校验问题</button>
  </view>
</template>

<script lang="ts" setup>
import { navTo } from '@/utils/util'
</script>

<style lang="scss" scoped>
//
</style>
