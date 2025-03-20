export default {
    // 数据
    item: {
        type: Object,
        default: () => null,
    },

    // 下标
    index: {
        type: Number,
        default: 0,
    },

    // 资源是否加载完成
    loaded: {
        type: Boolean,
        default: false,
    },

    // 是否立即执行一次
    immediate: {
        type: Boolean,
        default: false,
    },

    // 元素渲染完成或资源加载完成后查询元素信息的延迟时长，毫秒
    // 如果图片资源较大，虽然图片 load 了，但是现实到页面上也会消耗时间，可能会造成不能正常获取到元素的高度，导致布局异常，此时，可适当调整增加此值
    delay: {
        type: Number,
        default: 200,
    },
};
