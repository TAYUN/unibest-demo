<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '隐藏表单的校验问题',
  },
}
</route>

<template>
  <view class="">
    <wd-form ref="form" :model="formData" :rules="{}">
      <wd-input
        label="名字"
        v-model="formData.name"
        prop="name"
        required
        placeholder="请输入名字"
        :rules="[{ required: true, message: '请填写名字' }]"
      ></wd-input>

      <wd-input
        v-if="0"
        label="年龄"
        v-model="formData.age"
        prop="age"
        required
        :rules="[{ required: true, message: '请填写年龄' }]"
        placeholder="请输入年龄"
      ></wd-input>
    </wd-form>
    <button @click="submitForm">提交</button>
  </view>
  <wd-form ref="form2" :model="model">
    <wd-cell-group border>
      <wd-input
        label="用户名"
        label-width="100px"
        prop="value1"
        clearable
        v-model="model.value1"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <wd-input
        label="密码"
        label-width="100px"
        prop="value2"
        show-password
        clearable
        v-model="model.value2"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </wd-cell-group>
    <view class="footer">
      <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
    </view>
  </wd-form>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'
const toast = useToast()
const form = ref(null)
const formData = reactive({
  name: null,
  age: null,
})
const submitForm = () => {
  form.value.validate().then(({ valid, errors }) => {
    console.log('valid', valid)
    if (valid) {
      toast.success('提交成功')
    } else {
      console.log('errors', errors)
      toast.error(errors[0].message)
    }
  })
}

const model = reactive<{
  value1: string
  value2: string
}>({
  value1: '',
  value2: '',
})

const form2 = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        toast.success('提交成功')
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
</script>

<style lang="scss" scoped>
//
</style>
