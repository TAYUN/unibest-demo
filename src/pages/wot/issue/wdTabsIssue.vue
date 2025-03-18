<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'tabs吸顶',
  },
}
</route>

<template>
  <view class="">
    <wd-tabs v-model="tab" :sticky="true" :offsetTop="-44" auto-line-width swipeable>
      <block v-for="item in 4" :key="item">
        <wd-tab :title="`标签${item}`">
          <view class="center text-4xl font-600 h-100vh text-green">{{ item }}</view>
        </wd-tab>
      </block>
    </wd-tabs>
  </view>
</template>

<script lang="ts" setup>
const tab = ref(0)
</script>

<style lang="scss" scoped>
//
</style>
