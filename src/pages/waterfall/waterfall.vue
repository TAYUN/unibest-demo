<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '瀑布流',
  },
}
</route>

<template>
  <view class="">
    <WatWaterfall
      ref="waterfallRef"
      :isOnShow="isOnShow"
      :queryList="getDataApi"
      :cardTemplate="WatWaterFallCard"
    >
      <template #top>
        <!-- 瀑布流tabs -->
        <view class="tabs-sticky" v-if="tabList.length">
          <wd-tabs class="overflow-hidden" slidable="always" v-model="tab" @change="tabChange">
            <block v-for="item in tabList" :key="item.id">
              <wd-tab :title="item.title"></wd-tab>
            </block>
          </wd-tabs>
        </view>
      </template>
      <template #card="{ data, idx, onImageLoad, onImageError }">
        <WatWaterFallCard
          :data="data"
          :idx="idx"
          @onImageLoad="onImageLoad"
          @onImageError="onImageError"
        />
      </template>
    </WatWaterfall>
  </view>
</template>

<script lang="ts" setup>
import { generateMockData, mockTabListApi } from './components/mockApi'
import WatWaterfall from './components/WatWaterfall.vue'
import WatWaterFallCard from './components/WatWaterFallCard.vue'

const waterfallRef = ref(null)
const isOnShow = ref(false)

// tabs信息
const tabList = ref([])
const tab = ref(0)
const curTabId = ref(null)
// const tabsData = ref({}) // 存储tabs数据(暂未使用)
// 获取分类tabs
const mockTabList = async () => {
  const res = await mockTabListApi()
  if (res.code !== 200) {
    console.error(res.message)
    // tabList.value = []
    return
  }
  const tabSort = res.data.map((item) => ({ title: item.title, id: item.id }))
  tabList.value = [{ title: '全部', id: null }].concat(tabSort)
}
// tabs切换
const tabChange = async ({ index }) => {
  tab.value = index
  curTabId.value = tabList.value[index].id
  waterfallRef.value && waterfallRef.value.reloadData()
}

const getDataApi = async (page, pageSize) => {
  try {
    const res = await generateMockData({
      page,
      pageSize,
      tabId: curTabId.value,
    })
    if (res.code !== 200) throw new Error(res.message || '获取数据失败')
    return {
      dataList: res.data.items.map((item) => ({
        id: item.id,
        title: item.title,
        thumb: item.thumb,
        price: item.price,
        originalPrice: item.originalPrice,
        communityMerchant: {
          title: item.communityMerchant.title,
          avatar: item.communityMerchant.avatar,
        },
      })),
      totalPage: res.data.pageInfo.totalPages,
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    throw new Error('API请求失败', error)
  }
}

onPullDownRefresh(() => {
  waterfallRef.value && waterfallRef.value.reloadData()
  uni.stopPullDownRefresh()
})
onLoad(() => {
  mockTabList()
})
onShow(() => {
  isOnShow.value = true
})
onHide(() => {
  isOnShow.value = false
})
//
</script>

<style lang="scss" scoped>
//
</style>
