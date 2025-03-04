<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '测试页面2',
  },
}
</route>

<template>
  <view>
    <view>对比值：50</view>
    <wd-input
      v-model="inputValue"
      type="digit"
      InputMode="decimal"
      placeholder="0.00"
      :no-border="true"
      @blur="taskA($event, row)"
      @focus="onFocusEarly"
    ></wd-input>
    <wd-button @click="taskB">提交</wd-button>
  </view>
</template>

<script lang="ts" setup>
const inputValue = ref('')
</script>

<style lang="scss" scoped>
//
</style>
