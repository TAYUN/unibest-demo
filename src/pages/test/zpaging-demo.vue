<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'zpaging内容器滚动失效demo',
  },
}
</route>

<template>
  <z-paging ref="paging" v-model="list" @query="queryList">
    <template #top>
      <view class="center py-1 bg-#fff">下面这个滚动容器时常滚动失效</view>
      <view class="pb-2 flex items-center overflow-auto h-100px border-b-(1px solid #eee) bg-#fff">
        <text
          class="mx-2 p-2 shrink-0 text-14px text-center bg-#f2f3f7 rounded"
          v-for="(item, index) in 100"
          :key="index"
        >
          {{ item }}
        </text>
      </view>
    </template>
    <block v-for="(item, index) in list" :key="index">
      <view class="center py-5 border-b-(1px solid #eee)">item-{{ index }}</view>
    </block>
  </z-paging>
</template>

<script lang="ts" setup>
const paging = ref(null)
const list = ref([])
const queryList = (page, pageSize) => {
  const arr = []
  for (let i = 0; i < 10; i++) {
    arr.push(i)
  }
  paging.value.complete(arr)
}
</script>

<style lang="scss" scoped>
//
</style>
