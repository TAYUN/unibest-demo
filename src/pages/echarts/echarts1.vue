<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'ECharts',
  },
}
</route>

<template>
  <view class="">
    <view style="width: 100%; height: 500rpx">
      <l-echart ref="chart"></l-echart>
    </view>
  </view>
</template>

<script setup>
// // 引入全量包
// import * as echarts from 'echarts'
// ---or----------------------------------

// 或者按需引入
import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])
const chart = ref(null)
const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    confine: true,
  },
  legend: {
    data: ['热度', '正面', '负面'],
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 15,
    top: 40,
    containLabel: true,
  },
  xAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999999',
        },
      },
      axisLabel: {
        color: '#666666',
      },
    },
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
      axisLine: {
        lineStyle: {
          color: '#999999',
        },
      },
      axisLabel: {
        color: '#666666',
      },
    },
  ],
  series: [
    {
      name: '热度',
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'inside',
        },
      },
      data: [300, 270, 340, 344, 300, 320, 310],
    },
    {
      name: '正面',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true,
        },
      },
      data: [120, 102, 141, 174, 190, 250, 220],
    },
    {
      name: '负面',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true,
          position: 'left',
        },
      },
      data: [-20, -32, -21, -34, -90, -130, -110],
    },
  ],
})

onMounted(() => {
  chart.value.init(echarts, (chart) => {
    chart.setOption(option.value)
  })
})
</script>

<style lang="scss" scoped>
//
</style>
