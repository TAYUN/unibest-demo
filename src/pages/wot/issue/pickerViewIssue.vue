<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'pickerView滑动问题',
  },
}
</route>

<template>
  <view class="">
    <button @tap="showPicker(8)">1.选择-{{ pickerValue }}</button>
    <button @tap="showPicker(5)">2.选择-{{ pickerValue }}</button>
    <wd-popup v-model="show" position="bottom">
      <view class="h-300px">
        <view class="flex justify-between items-center p-3 bg-#f2f3f5">
          <text @tap="show = false">取消</text>
          <text class="font-600">请选中</text>
          <text class="text-blue" @tap="onConfirm">确定</text>
        </view>
        <wd-picker-view :columns="columns" v-model="pickerValue"></wd-picker-view>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
const show = ref(false)
const len = ref(10)
const pickerValue = ref(1)
const columns = ref(Array.from({ length: 9 }, (_, index) => index + 1))

const showPicker = (l) => {
  show.value = true
  len.value = l
  // 模拟初始化
  pickerValue.value = 2
}
const onConfirm = () => {
  show.value = false
}
</script>

<style lang="scss" scoped>
//
</style>
