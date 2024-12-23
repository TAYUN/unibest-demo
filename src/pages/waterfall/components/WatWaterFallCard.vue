<template>
  <view class="box-border bg-#fff rounded-2 overflow-hidden">
    <view>
      <!-- 图片 -->
      <view class="mb-1">
        <image
          class="w-full"
          :src="data.thumb"
          mode="widthFix"
          @load="handleLoad"
          @error="handleError"
        />
      </view>
      <!-- body -->
      <view class="p-2">
        <!-- 标题 -->
        <view class="mb-1 text-15px">{{ data.title }}</view>
        <!-- 价格 -->
        <view class="mb-1 flex items-end">
          <view class="text-14px font-medium leading-17px text-red">￥</view>
          <view class="ml--2px text-18px font-medium leading-18px text-red">
            {{ data.price }}
          </view>

          <view class="mx-2px text-14px leading-14px text-#999 line-through">
            ￥{{ data.originalPrice }}
          </view>
        </view>
        <!-- 商家 -->
        <view class="flex items-center min-w-0">
          <image
            class="flex-shrink-0 w-18px h-18px rounded-full"
            :src="data.communityMerchant.avatar"
            mode="scaleToFill"
          />
          <text class="ml-1 text-13px text-#666 truncate ellipsis">
            {{ data.communityMerchant.title }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  width: {
    type: [Number, String],
    default: 175,
  },
  idx: {
    type: String,
    required: true,
  },
})

// 超时时间：5秒
const LOAD_TIMEOUT = 5000
// 定时器引用
let timeoutHandler: NodeJS.Timeout | null = null
// 标记图片是否已处理
let isHandled = false

const emit = defineEmits(['onImageLoad', 'onImageError'])

/**
 * 图片加载完成
 */
const handleLoad = () => {
  if (isHandled) return // 如果已处理过，则不再重复处理
  isHandled = true

  // 加载完成，清除超时定时器
  if (timeoutHandler) {
    clearTimeout(timeoutHandler)
    timeoutHandler = null
  }
  emit('onImageLoad', 1) // 通知父组件加载成功
}

/**
 * 图片加载失败
 */
const handleError = () => {
  if (isHandled) return // 如果已处理过，则不再重复处理
  isHandled = true

  // 加载失败，清除超时定时器
  if (timeoutHandler) {
    clearTimeout(timeoutHandler)
    timeoutHandler = null
  }
  emit('onImageError', { idx: props.idx, reason: 'error' }) // 通知父组件加载失败
}

/**
 * 图片加载超时的处理
 */
const onTimeout = () => {
  if (isHandled) return // 如果已处理过，则不再重复处理
  isHandled = true

  emit('onImageError', { idx: props.idx, reason: 'timeout' }) // 通知父组件加载超时
}

/**
 * 设置超时检测
 */
const setImageTimeout = () => {
  timeoutHandler = setTimeout(() => {
    onTimeout()
  }, LOAD_TIMEOUT)
}

// 初始化超时检测
onMounted(() => {
  setImageTimeout()
})

// 清理超时定时器（组件销毁时）
onUnmounted(() => {
  if (timeoutHandler) {
    clearTimeout(timeoutHandler)
    timeoutHandler = null
  }
})
</script>

<style lang="scss" scoped></style>
