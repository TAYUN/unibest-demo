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
    <view>比对值：50</view>
    <wd-input v-model="inputVal" @blur="onBlur" @focus="onFocus"></wd-input>
    <wd-button @click="onClick">提交</wd-button>
  </view>
</template>

<script lang="ts" setup>
import { useMessage, useToast } from 'wot-design-uni'

const inputVal = ref(0)
const message = useMessage()
const toast = useToast()
const temNum = ref(0)
let cResultPromise // 用于存储 C 任务的 Promise
const watConfirm = async (options) => {
  message
    .confirm(options)
    .then(() => {
      return true
    })
    .catch(() => {
      return false
    })
}
const onFocus = ({ value }) => {
  temNum.value = +value
}
const onBlur = async ({ value }) => {
  // 任务 C 可能失败，所以用 try-catch 保护
  if (value > 50) {
    const result = watConfirm({
      title: '提示',
      msg: '您输入的值不能大于50',
      type: 'alert',
    })
    inputVal.value = temNum.value
  } else {
    const res = await mockApi()
    if (res) {
      toast.success('修改值成功')
      inputVal.value = +value
    } else {
      toast.error('修改值失败')
      inputVal.value = temNum.value
    }
  }
}

const showMsg = (msg) => {
  watConfirm({
    title: '提交表单了',
    msg: `结果：${msg ? '成功' : '失败'}`,
    type: 'alert',
  })
}
const onSubmit = async () => {
  const res = await mockApi()
  showMsg(res)
}
const mockApi = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const boolean = Math.random() > 0.1
      resolve(boolean)
    }, 1000)
  })
}
const onClick = async () => {
  // if (cResultPromise) {
  //   const result = await cResultPromise
  //   if (result) {
  //     onSubmit()
  //   }
  // } else {
  //   onSubmit()
  // }
}
</script>

<style lang="scss" scoped>
//
</style>
