<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '柱状图',
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

<script lang="ts" setup>
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
const options = ref({
  title: {
    text: 'ECharts 入门示例',
  },
  tooltip: {},
  legend: {
    data: ['销量'],
  },
  xAxis: {
    type: 'category',
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '销量',
      type: 'bar',
      label: {
        normal: {
          position: 'right',
        },
      },
      data: [5, 20, 36, 10, 10, 20],
    },
    {
      name: '使用',
      type: 'bar',
      label: {
        normal: {
          position: 'left',
        },
      },
      data: [23, 10, 60, 40, 10, 30],
    },
  ],
})
onMounted(() => {
  chart.value.init(echarts, (chart) => {
    chart.setOption(options.value)
  })
})
</script>

<style lang="scss" scoped>
//
</style>
