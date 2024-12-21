<template>
  <view class="box-border bg-#fff rounded-2 overflow-hidden">
    <view class="">
      <!-- 图片 -->
      <view class="mb-1">
        <image class="w-full" :src="data.image" mode="widthFix" @load="load" @error="imageError" />
      </view>
      <!-- body -->
      <view>
        <!-- 标题 -->
        <view class="mb-1 text-15px">{{ data.title }}</view>
        <!-- 价格 -->
        <view class="mb-1 flex items-end">
          <view class="text-14px font-medium leading-17px text-price">￥</view>
          <view class="ml--2px text-[18px] font-medium leading-18px text-price">
            {{ data.price }}
          </view>

          <view class="mx-2px text-14px leading-14px text-#999 line-through">
            ￥{{ data.originalPrice }}
          </view>
        </view>
        <!-- 标签 -->
        <!-- <view></view> -->
        <!-- 商家 -->
        <view class="flex items-center min-w-0">
          <image
            class="flex-shrink-0 w-18px h-18px rounded-full"
            :src="data.merchant.avatar"
            mode="scaleToFill"
          />
          <text class="ml-1 text-13px text-#666 truncate ellipsis">
            {{ data.merchant.title }}
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
    default: true,
  },
})
const emit = defineEmits(['onImageLoad', 'onImageError'])
const load = () => {
  // 加载完成返回1
  emit('onImageLoad', 1)
}
const imageError = () => {
  // 加载失败返回一个标识
  emit('onImageError', props.idx)
}
</script>

<style lang="scss" scoped>
//
</style>
