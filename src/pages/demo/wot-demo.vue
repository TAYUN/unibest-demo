<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'WOT Demo',
  },
}
</route>

<template>
  <view class="">
    <!-- wd-input的默认样式的覆盖问题  主题配置文件在布局文件default.vue-->
    <wd-cell-group class="mb-2" custom-class="group" title="基础信息" border>
      <wd-input
        label="测试商家的名称"
        :maxlength="30"
        v-model="obj.name"
        placeholder="请输入名称"
        prop="name"
      />
      <wd-input
        label="测试商家的负责人"
        label-width="120px"
        :maxlength="30"
        v-model="obj.leader"
        placeholder="请输入商家负责人"
        prop="name"
      />
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
const obj = ref({
  name: '',
  leader: '',
})
</script>

<style lang="scss" scoped>
//
</style>
