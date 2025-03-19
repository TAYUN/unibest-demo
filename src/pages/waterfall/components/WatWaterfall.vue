<!-- 两栏布局瀑布流 -->
<template>
  <view>
    <view class="tabs-sticky" v-if="$slots.top">
      <slot name="top"></slot>
    </view>
    <view
      class="fixed top-20 p-4 text-16px font-700 text-red text-left bg-#fff w-full opacity-99 z-99"
    >
      {{ columnHeights.odd <= columnHeights.even ? '放左边' : '放右边' }}
      <view class="mt-2">左边-{{ columnHeights.odd }}</view>
      <view class="mt-2">右边-{{ columnHeights.even }}</view>
      <view class="mt-2">差值-{{ heightDiff }}</view>
      <view class="mt-2">错误图片-{{ imgErrorCount }}</view>
      <view class="mt-2">allImgCount-{{ allImgCount }}</view>
      <view class="mt-2">loadedCount-{{ loadedCount }}</view>
      <view class="mt-2">pendingItems-{{ pendingItems.length }}</view>
      <view class="mt-2">加载中图片-{{ allImgCount - loadedCount }}</view>
      <view class="mt-2">allImgFinish-{{ allImgFinish }}</view>
    </view>

    <view class="flex" :style="{ paddingLeft: `${gapValue}px`, paddingTop: `${gapValue}px` }">
      <view v-for="(column, columnIndex) in columns" :key="columnIndex">
        <!-- 高度容器 -->
        <view :class="column.class">
          <view
            v-for="(item, index) in column.items"
            :key="index"
            :style="{ marginRight: `${gapValue}px`, marginBottom: `${gapValue}px` }"
          >
            <view :style="{ width: `${width}px` }">
              <!-- <component
                :is="cardTemplate"
                :data="item"
                :idx="`${column.prefix}-${index}`"
                @onImageLoad="onImageLoad"
                @onImageError="onImageError"
                @tap="toDetailPage(item.id)"
              ></component> -->
              <!-- 作用域插槽，暴露数据 -->
              <slot
                name="card"
                :data="item"
                :idx="`${column.prefix}-${index}`"
                :onImageLoad="onImageLoad"
                :onImageError="onImageError"
              ></slot>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载完成 -->
    <wd-loadmore v-if="state === 'finished' && hasItems" :state="state" />
    <!-- 没有数据的时候 显示内容 -->
    <view class="mb-3" v-else-if="!hasItems">
      <wd-status-tip image="content" :tip="state === 'loading' ? '正在加载' : '暂无内容'" />
    </view>
    <!-- 还有数据加载 显示加载中 -->
    <wd-loadmore v-else :state="state" />
  </view>
</template>

<script lang="ts" setup>
// 卡片组件
// import WatWaterFallCard from './WatWaterFallCard.vue'
const props = defineProps({
  isOnShow: Boolean,
  queryList: {
    required: true,
    type: Function,
  },
  cardTemplate: {
    required: true,
    type: Object,
  },
})
const columns = computed(() => [
  {
    class: 'odd-column',
    items: oddItems.value,
    prefix: 'odd',
  },
  {
    class: 'even-column',
    items: evenItems.value,
    prefix: 'even',
  },
])
// 数据列，用于存放左列和右列的内容
const oddItems = ref<any[]>([]) // 左列数据
const evenItems = ref<any[]>([]) // 右列数据
// 计算是否有数据
const hasItems = computed(() => oddItems.value.length > 0 || evenItems.value.length > 0)
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
// 布局信息
const gap = 8 // 卡片之间的间距，单位 px
const gapValue = parseGap(gap) // 解析后的间距值
const totalGap = 3 * gapValue // 左、中、右三部分的间距总和
const width = (windowWidth - totalGap) / 2 // 每列卡片的宽度

// 分页信息和加载状态
const state = ref<'loading' | 'finished'>('loading') // 数据加载状态
const pageInfo = ref({
  page: 1, // 当前页码
  pageSize: 10, // 每页显示的条数
  total: 0, // 数据总条数
})

/**
 * 获取数据
 * @returns 格式化后的数据数组
 */
const getData = async () => {
  if (!props.queryList) {
    console.error('queryList 方法未提供')
    return []
  }
  const result = await props.queryList(pageInfo.value.page, pageInfo.value.pageSize)
  if (!result) {
    return []
  }
  const { dataList, totalPage } = result

  if (pageInfo.value.page > totalPage) {
    state.value = 'finished'
  }
  pageInfo.value.page++ // 更新页码
  return dataList
}

// 记录左右列的高度
const columnHeights = reactive({ odd: 0, even: 0 }) // 两列的当前高度
const lastDis = computed(() => (columnHeights.odd <= columnHeights.even ? 0 : 1)) // 上一次分配的列
const heightDiff = computed(() => Math.abs(columnHeights.odd - columnHeights.even)) // 高度差
const heightThreshold = 220 // 高度差阈值
const fixCount = ref(3) // 矫正项数 不宜太大也不能太小 根据项目卡片的高度决定 这里卡片高度差一般不会太大，123就合适
const domError = ref(false) // 记录获取dom的时候有没有错误
// 用于查询左右列高度
const selectors = ['.odd-column', '.even-column']

/**
 * 获取左右列的高度
 * @param delay - 延迟时间（单位 ms）因为这里使用动态分配，所以不设置延迟了
 * @returns Promise<number[]> 左右列的高度数组
 */
const getHeights = async (delay = 0): Promise<number[]> => {
  await nextTick() // 确保 DOM 渲染完成
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const query = uni.createSelectorQuery()
        selectors.forEach((selector) => query.select(selector).boundingClientRect())
        query.exec((rects) => {
          if (!rects || rects[0] === null || rects[1] === null || !rects.length) {
            // 注意 这个情况比较特殊 不确认生产环境是否会触发
            reject(new Error('未能获取到节点信息'))
            return
          }
          const heights = rects.map((rect) => {
            if (!columnHeights.even && !columnHeights.odd && rects[0].height === 0) {
              console.error('dom异常，停止分配')
              domError.value = true
            } else {
              domError.value = false
            }
            return rect ? rect.height : 0
          })
          resolve(heights) // 成功返回高度数组
        })
      } catch (error) {
        reject(new Error(error))
      }
    }, delay)
  })
}

/**
 * 更新两列的高度
 */
const updateHeights = async (): Promise<void> => {
  try {
    const [oddHeight, evenHeight] = await getHeights() // 获取左右列高度
    if (!domError.value) {
      columnHeights.odd = oddHeight
      columnHeights.even = evenHeight
    }
  } catch (error) {
    domError.value = true
    console.error('获取瀑布高度失败:', error.message)
  }
}

// 图片加载状态
const allImgCount = ref(0)
const loadedCount = ref(0)
const allImgFinish = computed(() => loadedCount.value === allImgCount.value)
const canDynamic = computed(
  () => allImgCount.value - loadedCount.value === pendingItems.value.length,
)
const imgErrorCount = ref(0) // 加载失败或超时的图片数
// 分配模式和待分配数据
const pendingItems = ref<any[]>([]) // 等待动态调整的数据
const distMode = ref<'default' | 'dynamic'>('dynamic') // 分配模式 dynamic动态、default默认
const lastPush = ref<'odd' | 'even'>('odd') // 最近一次动态分配到的列

/**
 * 将新数据分配到两列
 * @param newList - 待分配的数据数组
 */
const distributeItems = async (newList: any[]): Promise<void> => {
  if (!newList.length) return // 数据为空时直接返回
  allImgCount.value += newList.length
  const adjNum = Math.min(fixCount.value, newList.length) // 计算需要矫正的项数
  if (newList.length <= adjNum) {
    // 数据量小于或等于矫正项数，全部加入待分配数组
    pendingItems.value.push(...newList)
    // 如果只有一条数据，直接触发分配逻辑
    if (newList.length === 1) {
      await dynamicDistribute()
    }
  } else {
    // 分割数据，前部分直接默认分配分配，后部分留作矫正
    const splitIndex = newList.length - adjNum
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
/**
 * 动态分配待分配的数据到两列
 */
const dynamicDistribute = async (): Promise<void> => {
  if (!pendingItems.value.length) return // 无待分配数据时直接返回

  if (distMode.value === 'dynamic') {
    // 动态分配模式：每次只分配一个数据
    const item = pendingItems.value.shift() // 移除数组的第一个元素
    if (columnHeights.odd <= columnHeights.even) {
      oddItems.value.push(item)
      lastPush.value = 'odd'
    } else {
      evenItems.value.push(item)
      lastPush.value = 'even'
    }
  } else {
    // 默认分配模式：一次性分配所有数据
    pendingItems.value.forEach((item) => {
      if (lastPush.value === 'even') {
        oddItems.value.push(item)
        lastPush.value = 'odd'
      } else {
        evenItems.value.push(item)
        lastPush.value = 'even'
      }
    })
    pendingItems.value = [] // 清空待分配数据
  }
}

/**
 * 图片加载完成的回调
 * @param count - 当前加载完成的图片数量
 */
const onImageLoad = async (count: number): Promise<void> => {
  loadedCount.value++
  if (canDynamic.value) {
    await updateHeights()
    //  如果高度差较大，动态调整最后两项，否则延续之前的分配方式
    // if (pendingItems.value.length >= fixCount.value) {
    //   这里如果一直用动态分配也可以
    //   distMode.value = heightDiff.value > heightThreshold ? 'dynamic' : 'default'
    // }
    if (!domError.value) {
      dynamicDistribute()
    }
  }
}

/**
 * 图片加载失败或超时的回调
 * @param param - 包含图片标识和失败原因的对象
 */
const onImageError = async (param: { idx: string; reason: 'timeout' | 'error' }): Promise<void> => {
  const { idx, reason } = param
  imgErrorCount.value++
  loadedCount.value++
  console.error(`图片加载失败: ${idx}, 原因: ${reason}`)
  // 替换图片为占位图
  const placeholderImage = 'https://dummyimage.com/240x240'
  const [column, index] = idx.split('-')
  if (column === 'even') {
    evenItems.value[Number(index)].thumb = placeholderImage
  } else if (column === 'odd') {
    oddItems.value[Number(index)].thumb = placeholderImage
  }

  if (canDynamic.value) {
    await updateHeights()
    //  如果高度差较大，动态调整最后两项，否则延续之前的分配方式
    // if (pendingItems.value.length >= fixCount.value) {
    //   这里如果一直用动态分配也可以
    //   distMode.value = heightDiff.value > heightThreshold ? 'dynamic' : 'default'
    // }
    if (!domError.value) {
      dynamicDistribute()
    }
  }
  // 超时
  // if (reason === 'timeout') {
  // }
}

// 跳转卡片详情页面
const toDetailPage = (id) => {
  uni.navigateTo({
    url: `/pages/meal/MealDetail?id=${id}`,
  })
}
// 数据加载状态
const isLoading = ref(false)
// 加载数据
const loadData = async (): Promise<void> => {
  if (isLoading.value || state.value === 'finished' || !allImgFinish.value) return
  isLoading.value = true
  try {
    const newItems = await getData()
    isReachBottom.value = false // 将触底状态改为false
    await distributeItems(newItems)
  } catch (err) {
    console.error('加载数据失败：', err)
  } finally {
    isLoading.value = false
  }
}
// 重置状态（不包括自维护状态）
const resetState = () => {
  columnHeights.odd = 0
  columnHeights.even = 0
  allImgCount.value = 0
  loadedCount.value = 0
  pendingItems.value = []
  oddItems.value = []
  evenItems.value = []
  state.value = 'loading'
  pageInfo.value = {
    page: 1, // 当前页码
    pageSize: 10, // 每页显示的条数
    total: 0, // 数据总条数
  }
}

// 刷新数据
const reloadData = async () => {
  resetState()
  await loadData()
}

// 初始化加载
onMounted(async () => {
  // getMealSortData()
  reloadData()
})

const isReachBottom = ref(false) // 触底状态
// 滚动触底事件
onReachBottom(() => {
  isReachBottom.value = true
})

// 监听触底状态、所有图片的加载状态
watchEffect(() => {
  if (allImgFinish.value && isReachBottom.value) {
    loadData()
  }
})

// 如果获取dom节点信息有异常，就停止动态分配，等待下次页面的onShow再分配渲染
watch(
  () => props.isOnShow,
  (newVal) => {
    if (newVal && domError.value) {
      // console.log(' 继续分配')
      dynamicDistribute()
    }
  },
)
// 提供给父级刷新用
defineExpose({
  reloadData,
  pageInfo,
})
</script>

<style lang="scss" scoped>
.tabs-sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: calc(var(--status-bar-height));
  z-index: 2;
  width: 100%;
  overflow: hidden;
}
</style>
