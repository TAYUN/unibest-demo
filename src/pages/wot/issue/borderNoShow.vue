<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '边框不显示',
  },
}
</route>

<template>
  <view class="">
    <wd-cell-group border title="group标题">
      <wd-datetime-picker prop="reading_time" v-model="time" label="抄表时间"></wd-datetime-picker>
      <wd-datetime-picker prop="reading_time" v-model="time" label="抄表时间"></wd-datetime-picker>
      <wd-datetime-picker prop="reading_time" v-model="time" label="抄表时间"></wd-datetime-picker>
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
const time = ref(Date.now())
</script>

<style lang="scss" scoped>
//
</style>
