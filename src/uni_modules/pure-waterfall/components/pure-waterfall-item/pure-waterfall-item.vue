<!--
 * 瀑布流
 * @作者: 陈老师儿~
 * @手机: 18560000860
 -->
<template>
  <view class="pure-waterfall-item" :class="classes" :style="styles">
    <view class="pure-waterfall-item-content" :id="id">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import props from './props.js'
export default {
  options: {
    // 将自定义节点设置成虚拟的
    // #ifndef MP-TOUTIAO
    virtualHost: true,
    // #endif

    // 组件样式隔离
    styleIsolation: 'apply-shared',

    // 允许使用多个插槽
    multipleSlots: true,
  },
  props: props,
  emits: [],
  // addItem: 添加节点
  // deleteItem: 删除节点
  // cols: 列数
  // gap: 间距
  // layouts: 布局列表
  inject: ['addItem', 'deleteItem', 'cols', 'gap', 'layouts', 'setItemGetRectFunction'],
  data() {
    return {
      id: '', // 唯一标识
      isInit: false, // 是否初始化
      querying: false, // 是否正在查询中
      next: null, // 用来存储最后一次查询函数
    }
  },
  computed: {
    // classes
    classes() {
      const classes = []

      // 显示状态
      // 需已经初始化 && 已经计算好布局信息
      if (this.isInit && this.layout) classes.push('pure-waterfall-item-initialized')

      return classes
    },

    styles() {
      const styles = []

      // 顶部、左侧位置
      if (this.layout) {
        styles.push(`--pure-waterfall-item-top: ${this.layout?.top}px`)
        styles.push(
          `--pure-waterfall-item-left: calc(var(--pure-waterfall-column-width) * ${this.layout?.columnIndex} + var(--pure-waterfall-gap) * ${this.layout?.columnIndex})`,
        )
      }

      return styles
    },

    // 当前节点布局信息
    layout() {
      return this.layouts[this.id]
    },
  },
  watch: {
    // 数据变化后
    item: {
      handler() {
        // 重新获取元素布局信息
        this.getRect()
      },
      deep: true,
    },

    // 列数变化后
    cols: {
      handler(newCols) {
        // 重新获取元素布局信息
        this.getRect()
      },
    },

    // 间距变化后
    gap: {
      handler() {
        // 重新获取元素布局信息
        this.getRect()
      },
    },

    // 加载完成后
    loaded: {
      handler() {
        // 重新获取元素布局信息
        this.getRect()
      },
    },

    // 下标变化后
    index: {
      handler() {
        // 重新获取元素布局信息
        this.getRect()
      },
    },
  },
  mounted() {
    // 初始化ID
    this.id = `pure-waterfall-item_${this.randomString()}_${Date.now()}`

    // 立即执行一次、默认 loaded 为 true
    if (this.immediate || this.loaded) {
      // 获取元素布局信息
      this.getRect()
    }

    // 将获取节点信息的函数传递给父组件
    this.setItemGetRectFunction(this.id, this.getRect)
  },
  beforeUnmount() {
    // 从布局队列中删除
    this.deleteItem(this.id)
  },
  methods: {
    // 获取元素布局信息
    async getRect() {
      // 如果正在查询中
      if (this.querying) {
        // 将本次查询存储一下
        this.next = this.getRect

        return
      }

      // 更新查询状态
      this.querying = true

      // 稍微等待一下，确保元素已经渲染完成
      await this.$nextTick()
      await this.sleep(this.delay)

      // 查询
      uni
        .createSelectorQuery()
        .in(this)
        .select(`#${this.id}`)
        .boundingClientRect((rect) => {
          // 将数据添加到布局队列中
          if (rect) {
            this.addItem({
              id: this.id,
              index: this.index,
              width: rect.width,
              height: rect.height,
            })
          }

          // 更新查询状态
          this.querying = false

          // 更新初始化状态
          this.isInit = true

          // 如果有下一次查询
          if (this.next) {
            // 执行下一次查询
            let nextFn = this.next

            // 清空下一次查询
            this.next = null

            // 再查询
            nextFn()
          }
        })
        .exec()
    },

    // 生成一个36位的随机字符串
    randomString() {
      return (
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      )
    },

    // 同步延时
    sleep(time = 50) {
      return new Promise((resolve) => {
        let timer = setTimeout(() => {
          clearTimeout(timer)
          resolve()
        }, time)
      })
    },
  },
}
</script>

<style scoped>
@import './style.css';
</style>
