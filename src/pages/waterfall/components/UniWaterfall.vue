<!-- 两栏布局瀑布流 -->
<template>
  <view>
    <view
      class="fixed top-0 p-4 text-16px font-700 text-red z-999 text-left bg-#fff w-full opacity-80"
    >
      {{ columnHeights.odd <= columnHeights.even ? '放左边' : '放右边' }}
      <view class="mt-2">左边-{{ columnHeights.odd }}</view>
      <view class="mt-2">右边-{{ columnHeights.even }}</view>
      <view class="mt-2">差值-{{ heightDiff }}</view>
      <view class="mt-2">加载中图片-{{ totalImages - imageLoadCount }}</view>
      <view class="mt-2">错误图片-{{ imgErrorCount }}</view>
      <view class="mt-2">
        是否可以加载-{{ state !== 'finished' && !isLoading && isLoadFinish }}
      </view>
    </view>
    <view class="flex" :style="{ paddingLeft: `${gapValue}px` }">
      <!-- 奇数栏 -->
      <view>
        <!-- 高度容器 -->
        <view class="odd-column">
          <view
            :style="{ marginRight: `${gapValue}px`, marginBottom: `${gapValue}px` }"
            v-for="(item, index) in oddItems"
            :key="index"
          >
            <!-- 瀑布流卡片组件，换成自己的 idx用于图片加载失败处理-->
            <UniWaterFallCard
              :style="{ width: `${width}px` }"
              :data="item"
              :width="width"
              :idx="`odd-${index}`"
              @onImageLoad="onImageLoad"
              @onImageError="onImageError"
            ></UniWaterFallCard>
          </view>
        </view>
      </view>
      <!-- 偶数栏 -->
      <view>
        <!-- 高度容器 -->
        <view class="even-column">
          <view
            :style="{ marginRight: `${gapValue}px`, marginBottom: `${gapValue}px` }"
            v-for="(item, index) in evenItems"
            :key="index"
          >
            <!-- 瀑布流卡片组件，换成自己的 idx用于图片加载失败处理-->
            <UniWaterFallCard
              :style="{ width: `${width}px` }"
              :data="item"
              :width="width"
              :idx="`even-${index}`"
              @onImageLoad="onImageLoad"
              @onImageError="onImageError"
            ></UniWaterFallCard>
          </view>
        </view>
      </view>
    </view>
    <view class="p-4 text-center">{{ state === 'finished' ? '加载完成' : '正在加载' }}</view>
  </view>
</template>

<script lang="ts" setup>
// 卡片组件
import UniWaterFallCard from './UniWaterFallCard.vue'
import { generateMockData } from './mockApi'

// 图片格式化函数
// 获取套餐列表的接口

// 数据列，用于存放左列和右列的内容
const oddItems = ref<any[]>([]) // 左列数据
const evenItems = ref<any[]>([]) // 右列数据

// 获取设备信息，计算卡片宽度
const sysInfo = uni.getSystemInfoSync()
const { windowWidth } = sysInfo

/**
 * 解析间距值
 * @param gap - 间距值，可以是字符串（如 "10px"）或数字
 * @returns 解析后的数值
 */
const parseGap = (gap: string | number): number => {
  if (typeof gap === 'string') {
    const match = gap.match(/^\d+/) // 提取数字部分
    return match ? parseFloat(match[0]) : 0
  }
  return typeof gap === 'number' ? gap : 0
}

const gap = 10 // 卡片之间的间距，单位 px
const gapValue = parseGap(gap) // 解析后的间距值
const totalGap = 3 * gapValue // 左、中、右三部分的间距总和
const width = (windowWidth - totalGap) / 2 // 每列卡片的宽度

// 分页信息和加载状态
const pageInfo = ref({
  page: 1, // 当前页码
  pageSize: 10, // 每页显示的条数
  total: 0, // 数据总条数
})
const state = ref<'loading' | 'finished'>('loading') // 数据加载状态

/**
 * 获取数据
 * @returns 格式化后的数据数组
 */
const getData = async (): Promise<any[]> => {
  // 调用模拟数据生成函数，获取指定页的数据
  const res = await generateMockData({
    page: pageInfo.value.page,
    pageSize: pageInfo.value.pageSize,
  })

  // 如果返回的代码不是200，表示请求失败，直接返回空数组
  if (res.code !== 200) {
    return []
  }

  // 格式化返回的数据，提取所需字段
  const dataList = res.data.items.map((item: any) => ({
    id: item.id,
    title: item.title,
    image: item.image,
    price: item.price, // 这里修改为返回正确的 price 字段
    originalPrice: item.originalPrice, // 同样修改为 originalPrice
    merchant: item.merchant,
  }))

  // 获取总页数
  const totalPages = res.data.pageInfo.totalPages

  // 更新分页信息，增加当前页码
  if (pageInfo.value.page < totalPages) {
    pageInfo.value.page++
  } else {
    // 如果当前页大于或等于总页数，更新状态为 'finished'
    state.value = 'finished'
  }

  // 随机打乱数据顺序（用于测试）
  return dataList.sort(() => Math.random() - 0.5)
}

// 记录左右列的高度
const columnHeights = reactive({ odd: 0, even: 0 }) // 两列的当前高度
const lastDis = computed(() => (columnHeights.odd <= columnHeights.even ? 0 : 1)) // 上一次分配的列
const heightDiff = computed(() => Math.abs(columnHeights.odd - columnHeights.even)) // 高度差
const heightThreshold = 220 // 高度差阈值
const fixCount = ref(2) // 矫正项数 不宜太大也不能太小 根据项目卡片的高度决定 这里卡片高度差一般不会太大，123就合适

// 用于查询左右列高度
const selectors = ['.odd-column', '.even-column']

/**
 * 获取左右列的高度
 * @param delay - 延迟时间（单位 ms）
 * @returns 左右列的高度数组
 */
const getHeights = async (delay = 0): Promise<number[]> => {
  await nextTick() // 确保 DOM 渲染完成
  return new Promise((resolve) => {
    setTimeout(() => {
      const query = uni.createSelectorQuery()
      selectors.forEach((selector) => query.select(selector).boundingClientRect())
      query.exec((rects) => {
        const heights = rects.map((rect) => (rect ? rect.height : 0))
        resolve(heights)
      })
    }, delay)
  })
}

// 图片加载状态
const totalImages = ref(0) // 当前需要加载的图片总数
const imageLoadCount = ref(0) // 已加载完成的图片数
// 注意!!! 这里不用全等，是因为， 发现图片加载失败的时候，计算会有偏差导致imageLoadCount会大于totalImages，不知道为啥？浏览器重新加载了？
const isLoadComplete = computed(() => imageLoadCount.value >= totalImages.value) // 判断是否图片加载完成默认分配的图片,
const isLoadFinish = computed(() => isLoadComplete.value && pendingItems.value.length === 0) // 判断是否加载完成所有图片
// 分配模式和待分配数据
const pendingItems = ref<any[]>([]) // 等待动态调整的数据
const distMode = ref<'default' | 'dynamic'>('dynamic') // 分配模式 dynamic动态、default默认
const lastPush = ref<'odd' | 'even'>('odd') // 最近一次动态分配到的列

/**
 * 动态分配待分配的数据到两列
 */
const dynamicDistribute = async (): Promise<void> => {
  if (!pendingItems.value.length) return // 无待分配数据时直接返回

  if (distMode.value === 'dynamic') {
    // 动态分配模式：每次只分配一个数据
    totalImages.value = 1
    imageLoadCount.value = 0
    const item = pendingItems.value.shift()
    if (columnHeights.odd <= columnHeights.even) {
      oddItems.value.push(item)
      lastPush.value = 'odd'
    } else {
      evenItems.value.push(item)
      lastPush.value = 'even'
    }
  } else {
    // 默认分配模式：一次性分配所有数据
    totalImages.value = pendingItems.value.length
    imageLoadCount.value = 0
    pendingItems.value.forEach((item) => {
      if (lastPush.value === 'even') {
        oddItems.value.push(item)
        lastPush.value = 'odd'
      } else {
        evenItems.value.push(item)
        lastPush.value = 'even'
      }
    })
    pendingItems.value = []
  }
}

/**
 * 图片加载完成的回调
 * @param count - 当前加载完成的图片数量
 */
const onImageLoad = async (count: number): Promise<void> => {
  imageLoadCount.value += count
  if (isLoadComplete.value) {
    await updateHeights()
    //  如果高度差较大，动态调整最后两项，否则延续之前的分配方式
    // if (pendingItems.value.length >= fixCount.value) {
    //   这里如果一直用动态分配也可以
    //   distMode.value = heightDiff.value > heightThreshold ? 'dynamic' : 'default'
    // }
    await dynamicDistribute()
  }
}
const imgErrorCount = ref(0)
/**
 * 图片加载失败的回调
 * @param idx - 图片在组件中的唯一标识
 */
const onImageError = (idx: string): void => {
  imgErrorCount.value++
  imageLoadCount.value++ // 加载失败也算加载过了
  // 解析 idx，获取列类型和索引
  const [column, index] = idx.split('-')
  console.log('idx', idx)

  // 替换图片为占位图
  const placeholderImage = 'https://via.placeholder.com/150'

  if (column === 'even') {
    evenItems.value[index].image = placeholderImage // 更新右列图片
  } else if (column === 'odd') {
    oddItems.value[index].image = placeholderImage // 更新左列图片
  }
}

/**
 * 更新两列的高度
 */
const updateHeights = async (): Promise<void> => {
  const [oddHeight, evenHeight] = await getHeights()
  columnHeights.odd = oddHeight
  columnHeights.even = evenHeight
}

/**
 * 将新数据分配到两列
 * @param newList - 待分配的数据数组
 */
const distributeItems = async (newList: any[]): Promise<void> => {
  if (!newList.length) return // 数据为空时直接返回
  const adjNum = Math.min(fixCount.value, newList.length) // 计算需要矫正的项数

  if (newList.length <= adjNum) {
    // 数据量小于或等于矫正项数，全部加入待分配数组
    totalImages.value = newList.length
    imageLoadCount.value = 0
    pendingItems.value.push(...newList)
  } else {
    // 分割数据，前部分直接默认分配分配，后部分留作矫正
    const splitIndex = newList.length - adjNum
    totalImages.value = splitIndex
    imageLoadCount.value = 0

    // 分配前部分数据到两列
    newList.slice(0, splitIndex).forEach((item, index) => {
      if (index % 2 === lastDis.value) {
        oddItems.value.push(item) // 左列
        lastPush.value = 'odd'
      } else {
        evenItems.value.push(item) // 右列
        lastPush.value = 'even'
      }
    })

    // 后部分数据加入待分配数组
    pendingItems.value.push(...newList.slice(splitIndex))
  }
}

// 数据加载状态
const isLoading = ref(false)
/**
 * 加载数据
 */
const loadData = async (): Promise<void> => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    const newItems = await getData()
    await distributeItems(newItems)
  } catch (err) {
    console.error('加载数据失败：', err)
  } finally {
    isLoading.value = false
  }
}

// 初始化加载
onMounted(async () => {
  await updateHeights()
  await loadData()
})

// 滚动触底事件
onReachBottom(() => {
  if (state.value !== 'finished' && !isLoading.value && isLoadFinish.value) {
    loadData()
  }
})
</script>

<style lang="scss" scoped></style>
