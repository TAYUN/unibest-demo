<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'wd-datetime-picker',
  },
}
</route>

<template>
  <view class="">
    <view class="text-red p-4 font-600">未解决</view>
    <view class="p-2">问题：@confirm 不执行疑问</view>
    <wd-datetime-picker
      v-model="formData.dates"
      customLabelClass="!w-fit !min-w-auto mr-auto'"
      label="租期"
      title="请选择出租时间"
      props="dates"
      alignRight
      clearable
      required
      type="date"
      :before-confirm="beforeDateConfirm"
      @confirm="handleDateConfirm"
    ></wd-datetime-picker>
    <wd-gap />

    <view class="text-green p-4 font-600">已经解决</view>
    <!-- ref 测试 -->
    <wd-datetime-picker
      v-model="dates"
      customLabelClass="!w-fit !min-w-auto mr-auto'"
      label="租期"
      title="请选择出租时间"
      props="dates"
      alignRight
      clearable
      required
      type="date"
    ></wd-datetime-picker>
    <view class="flex justify-around items-center">
      <button class="radio-btn center" @click="setDateEnd(1)">1月</button>
      <button class="radio-btn center" @click="setDateEnd(3)">3月</button>
      <button class="radio-btn center" @click="setDateEnd(6)">6月</button>
      <button class="radio-btn center" @click="setDateEnd(12)">一年</button>
    </view>
    <wd-gap />
    <view class="p-3 text-4">reactiv</view>
    <wd-datetime-picker
      v-model="formData.dates"
      customLabelClass="!w-fit !min-w-auto mr-auto'"
      label="租期"
      title="请选择出租时间"
      props="dates"
      alignRight
      clearable
      required
      type="date"
    ></wd-datetime-picker>
    <view class="flex justify-around items-center">
      <button class="radio-btn center" @click="setDateEndF(1)">1月</button>
      <button class="radio-btn center" @click="setDateEndF(3)">3月</button>
      <button class="radio-btn center" @click="setDateEndF(6)">6月</button>
      <button class="radio-btn center" @click="setDateEndF(12)">一年</button>
    </view>
    <wd-gap />

    <!-- 表单测试 -->
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

const dates = ref([Date.now(), ''])
// 设置结束时间
const setDateEnd = (m) => {
  const startDate = dayjs(dates.value[0]) // 假设 dates[0] 存储了开始日期的时间戳
  const endDate = startDate.add(m, 'month') // 增加 m 个月
  dates.value[1] = endDate.valueOf() // 更新结束日期为新的时间戳
  // 测试打印
  const end = dayjs(dates.value[1]).format('YYYY-MM-DD') // 转换为年月日格式

  dates.value = [dates.value[0], end.valueOf()]
}
watch(dates, (newValue) => {
  console.log('newValue', newValue)
})

const formData = reactive({
  dates: [Date.now(), ''],
})

const setDateEndF = (m) => {
  const startDate = dayjs(formData.dates[0]) // 假设 dates[0] 存储了开始日期的时间戳
  const endDate = startDate.add(m, 'month') // 增加 m 个月
  formData.dates[1] = endDate.valueOf() // 更新结束日期为新的时间戳
  // 测试打印
  const end = dayjs(formData.dates[1]).format('YYYY-MM-DD') // 转换为年月日格式
  console.log('结束时间是', end)
  console.log('dates[1]', formData.dates[1])
  formData.dates = [formData.dates[0], end.valueOf()]
}

// 问题3：@confirm 不执行疑问
const hasAdjust = ref(false)
const beforeDateConfirm = (value, resolve, picker) => {
  picker.setLoading(true)
  console.log('beforeDateConfirm', value)
  console.log('!!hasAdjust.value', !!hasAdjust.value)
  if (hasAdjust.value) {
    resolve(false)
  } else {
    resolve(true)
  }
  picker.setLoading(false)
}
// 确认租期
const handleDateConfirm = ({ value }) => {
  console.log('handleDateConfirm', value)
  hasAdjust.value = true
}
</script>

<style lang="scss" scoped>
//
</style>
