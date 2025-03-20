<!--
 * 瀑布流
 * @作者: 陈老师儿~
 * @手机: 18560000860
 -->
<template>
  <view class="pure-waterfall" :class="classes" :style="styles">
    <slot></slot>
  </view>
</template>

<script>
import props from './props.js'
import { computed } from 'vue'
export default {
  options: {
    // 将自定义节点设置成虚拟的
    // 头条、飞书：因为合并后丢失事件和 'provide/inject'
    // 京东：因为合并后不能合并外层 'class'
    // 百度：因为合并后会在控制台疯狂报警告
    // #ifndef MP-TOUTIAO || MP-LARK || MP-JD || MP-BAIDU
    virtualHost: true,
    // #endif

    // 组件样式隔离
    styleIsolation: 'apply-shared',

    // 允许使用多个插槽
    multipleSlots: true,
  },
  props: props,
  emits: [],
  data() {
    return {
      items: {}, // 子元素
      layouts: {}, // 布局数据
      height: 0, // 容器高度
      timer: null, // 计算定时器
      debug: false, // 是否开启调试模式
      // 子元素获取节点信息的函数
      // 抖音小程序子组件监听不到 cols 和 gap 变化，所以需要通过父组件重新获取子元素的信息
      itemGetRectFunctions: {},
    }
  },
  computed: {
    // classes
    classes() {
      const classes = []
      return classes
    },

    // styles
    styles() {
      const styles = []

      // 高度
      styles.push(`--pure-waterfall-height: calc(${this.height}px - var(--pure-waterfall-gap))`)

      // 间距
      styles.push(`--pure-waterfall-gap: ${this.gap}`)

      // 列数
      styles.push(`--pure-waterfall-columns: ${this.cols}`)

      return styles
    },
  },
  watch: {
    // 子元素变化后
    items: {
      handler() {
        // 重新创建计算定时器
        this.createTimer()
      },
      deep: true,
    },

    // #ifdef MP-TOUTIAO || MP-LARK
    // 列数变化后
    cols: {
      handler() {
        for (let id in this.itemGetRectFunctions) {
          // 判断 itemGetRectFunction 是否是个函数
          if (typeof this.itemGetRectFunctions[id] === 'function') {
            // 执行 itemGetRectFunction 函数
            this.itemGetRectFunctions[id]()
          }
        }
      },
    },

    // 间距变化后
    gap: {
      handler() {
        for (let id in this.itemGetRectFunctions) {
          // 判断 itemGetRectFunction 是否是个函数
          if (typeof this.itemGetRectFunctions[id] === 'function') {
            // 执行 itemGetRectFunction 函数
            this.itemGetRectFunctions[id]()
          }
        }
      },
    },
    // #endif
  },
  methods: {
    // 添加子元素
    async addItem(item) {
      // 添加到子元素列表中
      this.items[item.id] = item

      // 创建计算定时器
      this.createTimer()
    },

    // 删除子元素
    async deleteItem(id) {
      // 删除子元素列表中的子元素
      delete this.items[id]

      // 删除布局数据
      delete this.layouts[id]

      // 创建计算定时器
      this.createTimer()
    },

    // 计算布局
    calcLayouts() {
      // 克隆一下子元素列表，避免后续添加的子元素影响到本次布局
      const items = this.deepClone(this.items)

      // 将 items 转成数组
      const arr = Object.values(items)

      // 将 items 数组按 index 从小到大排序
      arr.sort((a, b) => a.index - b.index)

      // 初始化列高度
      let heights = new Array(Number(this.cols)).fill(0)

      // 遍历子元素列表
      for (let i = 0; i < arr.length; i++) {
        // 获取当前子元素
        const item = arr[i]

        // 获取当前子元素的高度
        const height = item.height

        // 查找最短列的索引和高度
        const { shortestColumnIndex, shortestColumnHeight } = this.findShortestColumn(heights)

        // 添加到布局数据
        // 如果 this.layouts = layouts 会失去响应性，所以要一个一个的替换
        this.layouts[item.id] = {
          columnIndex: shortestColumnIndex, // 当前子元素所在的列索引
          top: shortestColumnHeight, // 当前子元素的顶部位置
          ...item,
        }

        // 更新当前列的高度
        heights[shortestColumnIndex] = shortestColumnHeight + height
      }

      // 更新容器高度
      this.height = Math.max(...heights)
    },

    // 创建计算定时器
    createTimer() {
      this.clearTimer()
      this.timer = setTimeout(this.calcLayouts, 50)
    },

    // 清除计算定时器
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },

    // 查找最短列的索引和高度
    findShortestColumn(heights) {
      // 初始化最短列的索引
      let shortestColumnIndex = 0

      // 初始化最短列的高度
      let shortestColumnHeight = heights[0]

      // 遍历列高度列表
      for (let i = 1; i < heights.length; i++) {
        // 如果当前列的高度小于最短列的高度
        if (heights[i] < shortestColumnHeight) {
          // 更新最短列的索引
          shortestColumnIndex = i

          // 更新最短列的高度
          shortestColumnHeight = heights[i]
        }
      }

      // 返回最短列的索引和高度
      return {
        shortestColumnIndex,
        shortestColumnHeight,
      }
    },

    // 深克隆对象或数组
    deepClone(target) {
      // 如果目标是 null 或者不是对象类型，直接返回目标本身
      if (target === null || typeof target !== 'object') {
        return target
      }

      let clone
      // 判断目标是数组还是对象
      if (Array.isArray(target)) {
        // 如果是数组，创建一个新的空数组
        clone = []
        // 遍历数组的每个元素
        for (let i = 0; i < target.length; i++) {
          // 递归调用 deepClone 函数克隆每个元素
          clone[i] = this.deepClone(target[i])
        }
      } else {
        // 如果是对象，创建一个新的空对象
        clone = {}
        // 遍历对象的每个属性
        for (let key in target) {
          if (target.hasOwnProperty(key)) {
            // 递归调用 deepClone 函数克隆每个属性的值
            clone[key] = this.deepClone(target[key])
          }
        }
      }
      return clone
    },

    // 设置子元素获取节点信息的函数
    setItemGetRectFunction(id, func) {
      if (id) {
        this.itemGetRectFunctions[id] = func
      }
    },
  },
  provide() {
    return {
      cols: computed(() => this.cols),
      gap: computed(() => this.gap),
      layouts: this.layouts,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      setItemGetRectFunction: this.setItemGetRectFunction,
    }
  },
}
</script>

<style scoped>
@import './style.css';
</style>
